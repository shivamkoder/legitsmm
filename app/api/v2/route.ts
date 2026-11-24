import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { hashApiKey } from "@/lib/api-key";
import { addOrder, getSupplier, SupplierError } from "@/lib/suppliers/client";

export const maxDuration = 60;

type PlaceOrderResult = {
  order_id: number;
  charge: number;
  supplier_id: number;
  supplier_service_id: string;
};

const RPC_ERRORS: Record<string, string> = {
  service_not_found: "Incorrect service ID",
  invalid_link: "Invalid link",
  quantity_out_of_range: "Quantity is outside the allowed min/max range",
  insufficient_balance: "Not enough funds on balance",
  no_supplier_available: "Service is temporarily unavailable",
};

const STATUS_DISPLAY: Record<string, string> = {
  pending: "Pending",
  processing: "Processing",
  "in-progress": "In progress",
  in_progress: "In progress",
  completed: "Completed",
  partial: "Partial",
  canceled: "Canceled",
};

const errMsg = (e: unknown) => (e instanceof Error ? e.message : String(e));

async function parseParams(req: NextRequest): Promise<Record<string, string>> {
  const params: Record<string, string> = {};

  // Allow query params as fallback
  req.nextUrl.searchParams.forEach((v, k) => {
    params[k] = v;
  });

  const ct = (req.headers.get("content-type") ?? "").toLowerCase();
  try {
    if (ct.includes("application/json")) {
      const json = await req.json();
      if (json && typeof json === "object") {
        for (const [k, v] of Object.entries(json)) {
          if (v !== undefined && v !== null) params[k] = String(v);
        }
      }
    } else if (ct.includes("application/x-www-form-urlencoded") || ct.includes("multipart/form-data")) {
      const fd = await req.formData();
      fd.forEach((v, k) => {
        if (typeof v === "string") params[k] = v;
      });
    } else {
      const raw = await req.text();
      if (raw.trim()) {
        if (raw.trim().startsWith("{")) {
          const json = JSON.parse(raw);
          for (const [k, v] of Object.entries(json)) {
            if (v !== undefined && v !== null) params[k] = String(v);
          }
        } else {
          new URLSearchParams(raw).forEach((v, k) => {
            params[k] = v;
          });
        }
      }
    }
  } catch {
    // Ignore malformed body; validation below will handle missing required fields.
  }

  return params;
}

/**
 * Standard SMM Panel v2 API endpoint.
 * Supports actions: services, balance, add, status (single & multi).
 */
export async function POST(req: NextRequest) {
  const params = await parseParams(req);
  const apiKey = (params.key ?? "").trim();
  const action = (params.action ?? "").trim().toLowerCase();

  if (!apiKey) {
    return NextResponse.json({ error: "API key is required" }, { status: 401 });
  }
  if (!action) {
    return NextResponse.json({ error: "Action is required" }, { status: 400 });
  }

  const admin = createAdminClient();
  const keyHash = hashApiKey(apiKey);

  const { data: profile, error: profErr } = await admin
    .from("profiles")
    .select("id, balance, is_banned")
    .eq("api_key_hash", keyHash)
    .maybeSingle();

  if (profErr) {
    console.error("[api/v2] profile lookup failed:", profErr.message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
  if (!profile) {
    return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
  }
  if (profile.is_banned) {
    return NextResponse.json({ error: "Account is suspended" }, { status: 403 });
  }

  // 1. action=balance
  if (action === "balance") {
    return NextResponse.json({
      balance: Number(profile.balance ?? 0).toFixed(4),
      currency: "USD",
    });
  }

  // 2. action=services
  if (action === "services") {
    const { data: svcs, error: svcErr } = await admin
      .from("services")
      .select("id, name, type, platform, category, rate, min_qty, max_qty, refill, cancel_allowed")
      .eq("is_active", true)
      .order("id", { ascending: true });

    if (svcErr) {
      console.error("[api/v2] services read failed:", svcErr.message);
      return NextResponse.json({ error: "Could not load services" }, { status: 500 });
    }

    const formatted = (svcs ?? []).map((s) => ({
      service: s.id,
      name: s.name,
      type: s.type === "custom_comments" ? "Custom Comments" : "Default",
      category: `${s.platform} - ${s.category}`,
      rate: Number(s.rate).toFixed(4),
      min: String(s.min_qty),
      max: String(s.max_qty),
      refill: Boolean(s.refill),
      cancel: Boolean(s.cancel_allowed),
    }));

    return NextResponse.json(formatted);
  }

  // 3. action=add
  if (action === "add") {
    const serviceId = (params.service ?? "").trim();
    const link = (params.link ?? "").trim();
    const comments = (params.comments ?? "").trim();

    if (!serviceId) return NextResponse.json({ error: "Incorrect service ID" }, { status: 400 });
    if (!link || link.length > 500) return NextResponse.json({ error: "Invalid link" }, { status: 400 });

    const extra: Record<string, unknown> = {};
    let quantity = Number(params.quantity);

    if (comments) {
      const lines = comments
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);
      extra.comments = lines.join("\n");
      quantity = lines.length;
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
    }

    const { data, error: rpcErr } = await admin.rpc("place_order", {
      p_user: profile.id,
      p_service: serviceId,
      p_link: link,
      p_quantity: quantity,
      p_extra: extra,
    });

    if (rpcErr) {
      const known = Object.entries(RPC_ERRORS).find(([k]) => rpcErr.message.includes(k));
      if (known) {
        return NextResponse.json({ error: known[1] }, { status: 400 });
      }
      console.error("[api/v2] place_order failed:", rpcErr.message);
      return NextResponse.json({ error: "Could not place order" }, { status: 500 });
    }

    const placed = data as PlaceOrderResult;

    // Tag order source as 'api'
    await admin.from("orders").update({ source: "api" }).eq("id", placed.order_id);

    // Dispatch to single hardcoded supplier
    let lastError = "Supplier dispatch failed";
    try {
      const supplier = await getSupplier(placed.supplier_id);
      const supplierOrderId = await addOrder(supplier, {
        serviceId: placed.supplier_service_id,
        link,
        quantity,
        extra,
      });

      await admin
        .from("orders")
        .update({ supplier_order_id: supplierOrderId, status: "pending", source: "api" })
        .eq("id", placed.order_id);

      return NextResponse.json({ order: placed.order_id });
    } catch (e) {
      lastError = errMsg(e);
      if (e instanceof SupplierError && e.kind === "unknown") {
        await admin
          .from("orders")
          .update({ error: `unconfirmed: ${lastError}`, source: "api" })
          .eq("id", placed.order_id);
        return NextResponse.json({ order: placed.order_id });
      }
    }

    // Definitive rejection -> automatic refund via finalize_order
    await admin.rpc("finalize_order", {
      p_order: placed.order_id,
      p_status: "canceled",
      p_start_count: null,
      p_remains: null,
      p_error: lastError,
    });

    return NextResponse.json(
      { error: "Order could not be placed right now. You have not been charged." },
      { status: 502 },
    );
  }

  // 4. action=status (single or comma-separated multi-order status)
  if (action === "status") {
    const multi = (params.orders ?? "").trim();
    const single = (params.order ?? "").trim();

    if (multi) {
      const ids = multi
        .split(",")
        .map((s) => Number(s.trim()))
        .filter((n) => Number.isInteger(n) && n > 0)
        .slice(0, 100);

      if (ids.length === 0) {
        return NextResponse.json({ error: "Incorrect order IDs" }, { status: 400 });
      }

      const { data: rows, error: stErr } = await admin
        .from("orders")
        .select("id, charge, start_count, status, remains")
        .eq("user_id", profile.id)
        .in("id", ids);

      if (stErr) {
        return NextResponse.json({ error: "Could not fetch order statuses" }, { status: 500 });
      }

      const byId = new Map((rows ?? []).map((r) => [r.id, r]));
      const out: Record<string, unknown> = {};
      for (const id of ids) {
        const row = byId.get(id);
        if (!row) {
          out[String(id)] = { error: "Incorrect order ID" };
        } else {
          out[String(id)] = {
            charge: Number(row.charge ?? 0).toFixed(4),
            start_count: String(row.start_count ?? 0),
            status: STATUS_DISPLAY[row.status] ?? row.status,
            remains: String(row.remains ?? 0),
            currency: "USD",
          };
        }
      }
      return NextResponse.json(out);
    }

    const orderId = Number(single);
    if (!Number.isInteger(orderId) || orderId <= 0) {
      return NextResponse.json({ error: "Incorrect order ID" }, { status: 400 });
    }

    const { data: row, error: stErr } = await admin
      .from("orders")
      .select("id, charge, start_count, status, remains")
      .eq("user_id", profile.id)
      .eq("id", orderId)
      .maybeSingle();

    if (stErr) {
      return NextResponse.json({ error: "Could not fetch order status" }, { status: 500 });
    }
    if (!row) {
      return NextResponse.json({ error: "Incorrect order ID" }, { status: 404 });
    }

    return NextResponse.json({
      charge: Number(row.charge ?? 0).toFixed(4),
      start_count: String(row.start_count ?? 0),
      status: STATUS_DISPLAY[row.status] ?? row.status,
      remains: String(row.remains ?? 0),
      currency: "USD",
    });
  }

  return NextResponse.json({ error: `Unsupported action: ${action}` }, { status: 400 });
}
