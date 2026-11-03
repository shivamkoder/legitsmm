import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  addOrder,
  getSupplier,
  SupplierError,
} from "@/lib/suppliers/client";

export const maxDuration = 60;

type Candidate = { supplier_id: number; supplier_service_id: string };
type PlaceOrderResult = {
  order_id: number;
  charge: number;
  candidates: Candidate[];
};

// Errors raised by the place_order SQL function -> HTTP responses.
const RPC_ERRORS: Record<string, { status: number; message: string }> = {
  service_not_found: { status: 404, message: "Service not found or inactive." },
  quantity_out_of_range: { status: 400, message: "Quantity is outside the allowed range." },
  insufficient_balance: { status: 402, message: "Insufficient balance." },
  no_supplier_available: { status: 503, message: "This service is temporarily unavailable." },
};

const errMsg = (e: unknown) => (e instanceof Error ? e.message : String(e));

export async function POST(request: Request) {
  // 1. Identify the user from the session. Never from the request body.
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  const userId = auth?.claims?.sub;
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  // 2. Parse and validate input.
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const serviceId = body.serviceId;
  const link = typeof body.link === "string" ? body.link.trim() : "";
  const extra =
    body.extra && typeof body.extra === "object" && !Array.isArray(body.extra)
      ? (body.extra as Record<string, unknown>)
      : {};

  if (typeof serviceId !== "string" && typeof serviceId !== "number") {
    return NextResponse.json({ error: "Missing service." }, { status: 400 });
  }
  if (!link || link.length > 500) {
    return NextResponse.json({ error: "Invalid link." }, { status: 400 });
  }

  // Custom-comment services: quantity is the number of comment lines.
  let quantity = Number(body.quantity);
  if (typeof extra.comments === "string" && extra.comments.trim()) {
    quantity = extra.comments.split("\n").filter((l) => l.trim()).length;
  }
  if (!Number.isInteger(quantity) || quantity <= 0) {
    return NextResponse.json({ error: "Invalid quantity." }, { status: 400 });
  }

  const admin = createAdminClient();

  // 3. Atomically: lock the user's row, check the balance, deduct it, write the
  //    ledger entry and create the order as 'pending'. Price, min/max and the
  //    supplier list are all computed in the database, never from the client.
  const { data, error } = await admin.rpc("place_order", {
    p_user: userId,
    p_service: String(serviceId),
    p_link: link,
    p_quantity: quantity,
    p_extra: extra,
  });

  if (error) {
    const known = Object.entries(RPC_ERRORS).find(([key]) => error.message.includes(key));
    if (known) {
      return NextResponse.json({ error: known[1].message }, { status: known[1].status });
    }
    console.error("[orders] place_order failed:", error.message);
    return NextResponse.json({ error: "Could not place order." }, { status: 500 });
  }

  const placed = data as PlaceOrderResult;

  // 4. Dispatch to suppliers, cheapest first.
  //    not_sent / rejected -> safe to try the next supplier.
  //    unknown             -> the supplier MAY have the order, so stop here.
  let lastError = "no supplier";
  for (const c of placed.candidates) {
    try {
      const supplier = await getSupplier(c.supplier_id);
      const supplierOrderId = await addOrder(supplier, {
        serviceId: c.supplier_service_id,
        link,
        quantity,
        extra,
      });

      const { error: updError } = await admin
        .from("orders")
        .update({ supplier_id: c.supplier_id, supplier_order_id: supplierOrderId })
        .eq("id", placed.order_id);

      if (updError) {
        // The supplier has the order but we failed to record its id. Needs a human.
        console.error(
          `[orders] CRITICAL order ${placed.order_id} accepted by supplier ${c.supplier_id} ` +
            `as #${supplierOrderId} but DB update failed: ${updError.message}`,
        );
      }

      return NextResponse.json({
        success: true,
        orderId: placed.order_id,
        charge: placed.charge,
      });
    } catch (e) {
      lastError = errMsg(e);

      if (e instanceof SupplierError && e.kind === "unknown") {
        // Do not reroute and do not refund: it may have been accepted.
        await admin
          .from("orders")
          .update({ supplier_id: c.supplier_id, error: `unconfirmed: ${lastError}` })
          .eq("id", placed.order_id);
        console.error(`[orders] order ${placed.order_id} unconfirmed at supplier ${c.supplier_id}:`, lastError);
        return NextResponse.json(
          {
            success: true,
            orderId: placed.order_id,
            charge: placed.charge,
            warning: "Your order is being confirmed with our provider.",
          },
          { status: 202 },
        );
      }

      console.warn(`[orders] supplier ${c.supplier_id} failed (${lastError}), trying next`);
    }
  }

  // 5. Every supplier refused or was unreachable before sending: cancel and refund.
  const { error: refundError } = await admin.rpc("finalize_order", {
    p_order: placed.order_id,
    p_status: "canceled",
    p_start_count: null,
    p_remains: null,
    p_error: lastError,
  });
  if (refundError) {
    console.error(`[orders] CRITICAL refund failed for order ${placed.order_id}:`, refundError.message);
  }

  return NextResponse.json(
    { error: "We couldn't place this order right now. You have not been charged." },
    { status: 502 },
  );
}
