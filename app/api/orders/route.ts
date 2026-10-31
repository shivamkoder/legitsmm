import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Redis } from '@upstash/redis';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Initialize Upstash Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, serviceId, link, quantity } = body;

    if (!userId || !serviceId || !link || !quantity) {
      return NextResponse.json(
        { error: 'Missing required order parameters.' },
        { status: 400 }
      );
    }

    // 1. ATOMIC LOCK & BALANCE CHECK (Using Upstash Redis to prevent double-spending)
    const lockKey = `lock:user:${userId}`;
    const acquiredLock = await redis.set(lockKey, 'locked', {
      nx: true,
      ex: 5, // Lock expires automatically after 5 seconds
    });

    if (!acquiredLock) {
      return NextResponse.json(
        { error: 'Another transaction is in progress. Please try again.' },
        { status: 429 }
      );
    }

    try {
      // Fetch service details and pricing from Supabase
      const { data: service, error: serviceError } = await supabase
        .from('services')
        .select('*')
        .eq('id', serviceId)
        .eq('is_active', true)
        .single();

      if (serviceError || !service) {
        return NextResponse.json({ error: 'Service not found or inactive.' }, { status: 404 });
      }

      // Validate quantity limits
      if (quantity < service.min || quantity > service.max) {
        return NextResponse.json(
          { error: `Quantity must be between ${service.min} and ${service.max}.` },
          { status: 400 }
        );
      }

      // Calculate total charge: (rate per 1,000 * quantity) / 1000
      const totalCharge = Number(((service.rate * quantity) / 1000).toFixed(4));

      // Fetch user's current wallet balance
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('balance')
        .eq('id', userId)
        .single();

      if (userError || !user) {
        return NextResponse.json({ error: 'User not found.' }, { status: 404 });
      }

      if (user.balance < totalCharge) {
        return NextResponse.json({ error: 'Insufficient wallet balance.' }, { status: 400 });
      }

      // 2. DISPATCH TO UPSTREAM PROVIDER (MoreThanPanel / NiceSMM)
      // Determine API URL and Key based on service.provider_name
      const providerApiUrl =
        service.provider_name === 'morethanpanel'
          ? process.env.MORETHANPANEL_API_URL!
          : process.env.NICESMM_API_URL!;
          
      const providerApiKey =
        service.provider_name === 'morethanpanel'
          ? process.env.MORETHANPANEL_API_KEY!
          : process.env.NICESMM_API_KEY!;

      const params = new URLSearchParams({
        key: providerApiKey,
        action: 'add',
        service: service.upstream_service_id.toString(),
        link: link,
        quantity: quantity.toString(),
      });

      const upstreamResponse = await fetch(providerApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      });

      const upstreamData = await upstreamResponse.json();

      if (upstreamData.error) {
        return NextResponse.json(
          { error: `Upstream Provider Error: ${upstreamData.error}` },
          { status: 502 }
        );
      }

      const upstreamOrderId = upstreamData.order;

      // 3. DATABASE UPDATES (Deduct Balance & Insert Order)
      const newBalance = Number((user.balance - totalCharge).toFixed(4));

      // Update user balance
      const { error: balanceUpdateError } = await supabase
        .from('users')
        .update({ balance: newBalance })
        .eq('id', userId);

      if (balanceUpdateError) {
        throw new Error('Failed to update user balance in database.');
      }

      // Insert order record into Supabase
      const { data: orderData, error: orderInsertError } = await supabase
        .from('orders')
        .insert({
          user_id: userId,
          service_id: serviceId,
          upstream_order_id: upstreamOrderId,
          link: link,
          quantity: quantity,
          charge: totalCharge,
          status: 'Pending',
        })
        .select()
        .single();

      if (orderInsertError) {
        throw new Error('Failed to save order record.');
      }

      return NextResponse.json({
        success: true,
        message: 'Order placed successfully!',
        order: orderData,
      });

    } finally {
      // Release the Redis atomic lock
      await redis.del(lockKey);
    }

  } catch (err: any) {
    console.error('Order placement error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
