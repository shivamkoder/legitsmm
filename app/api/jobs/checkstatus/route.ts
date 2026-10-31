import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client with service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function handler(req: Request) {
  try {
    const body = await req.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId in job payload." }, { status: 400 });
    }

    // 1. Fetch order and its associated service/provider details from Supabase
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        services (
          provider_name,
          rate
        ),
        users (
          id,
          balance
        )
      `)
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    // If order is already completed or canceled, skip polling to save API limits
    if (['Completed', 'Canceled', 'Partial'].includes(order.status)) {
      return NextResponse.json({ message: "Order is already finalized.", status: order.status });
    }

    const provider = order.services?.provider_name;
    const upstreamOrderId = order.upstream_order_id;

    if (!provider || !upstreamOrderId) {
      return NextResponse.json({ error: "Invalid provider or missing upstream order ID." }, { status: 400 });
    }

    // 2. Setup Upstream API credentials & endpoint
    const providerApiUrl =
      provider === 'morethanpanel'
        ? process.env.MORETHANPANEL_API_URL!
        : process.env.NICESMM_API_URL!;
        
    const providerApiKey =
      provider === 'morethanpanel'
        ? process.env.MORETHANPANEL_API_KEY!
        : process.env.NICESMM_API_KEY!;

    // 3. Request status from upstream provider (SMM v2 API format)
    const params = new URLSearchParams({
      key: providerApiKey,
      action: 'status',
      order: upstreamOrderId.toString(),
    });

    const upstreamResponse = await fetch(providerApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    const upstreamData = await upstreamResponse.json();

    if (upstreamData.error) {
      console.error(`Upstash Polling Error for Order #${orderId}:`, upstreamData.error);
      return NextResponse.json({ error: upstreamData.error }, { status: 502 });
    }

    /* 
      Upstream response format expected:
      {
        "charge": "0.25",
        "start_count": "1200",
        "status": "Completed",
        "remains": "0"
      }
    */
    const newStatus = upstreamData.status || order.status;
    const startCount = parseInt(upstreamData.start_count) || order.start_count;
    const remains = parseInt(upstreamData.remains) || order.remains;

    // 4. Handle Partial or Canceled Refunds Automatically
    if (newStatus === 'Partial' && order.status !== 'Partial') {
      // Calculate refund for undelivered quantity: (Charge / Total Quantity) * Remains
      const unitPrice = order.charge / order.quantity;
      const refundAmount = Number((unitPrice * remains).toFixed(4));

      if (refundAmount > 0) {
        const newBalance = Number((order.users.balance + refundAmount).toFixed(4));

        // Credit user back
        await supabase
          .from('users')
          .update({ balance: newBalance })
          .eq('id', order.users.id);

        console.log(`Issued partial refund of $${refundAmount} to user ${order.users.id} for order #${orderId}`);
      }
    } else if (newStatus === 'Canceled' && order.status !== 'Canceled') {
      // Full refund for canceled orders
      const refundAmount = order.charge;
      const newBalance = Number((order.users.balance + refundAmount).toFixed(4));

      await supabase
        .from('users')
        .update({ balance: newBalance })
        .eq('id', order.users.id);

      console.log(`Issued full refund of $${refundAmount} to user ${order.users.id} for canceled order #${orderId}`);
    }

    // 5. Update order record in Supabase
    await supabase
      .from('orders')
      .update({
        status: newStatus,
        start_count: startCount,
        remains: remains,
      })
      .eq('id', orderId);

    return NextResponse.json({
      success: true,
      orderId,
      status: newStatus,
      remains,
    });

  } catch (error: any) {
    console.error('Background job check-status execution error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error.' }, { status: 500 });
  }
}

// Secure the route using QStash signature verification so only QStash can trigger it
export const POST = verifySignatureAppRouter(handler);
