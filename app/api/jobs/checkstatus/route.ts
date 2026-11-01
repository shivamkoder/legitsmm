import { Receiver } from "@upstash/qstash";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStatuses, getSupplier } from "@/lib/suppliers/client";
import { OPEN_STATUSES, isFinal, mapSupplierStatus } from "@/lib/suppliers/status";

// NOTE: do not export `dynamic` here. It is not allowed with cacheComponents: true.
// A POST route handler is always dynamic anyway.
export const maxDuration = 60;

const BATCH_SIZE = 100; // supplier limit per status request
const MAX_ORDERS_PER_RUN = 1000; // safety cap so one run can't exceed maxDuration

type OrderRow = {
  id: number;
  supplier_id: number;
  supplier_order_id: string;
  status: string;
  start_count: number | null;
  remains: number | null;
};

const errMsg = (e: unknown) => (e instanceof Error ? e.message : String(e));

export async function POST(req: NextRequest) {
  // 1. Verify the request really came from QStash (inside the handler, so a
  //    missing key can never crash the build).
  const body = await req.text();
  const receiver = new Receiver({
    currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY ?? "",
    nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY ?? "",
  });
  const valid = await receiver
    .verify({ signature: req.headers.get("upstash-signature") ?? "", body })
    .catch(() => false);
  if (!valid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const admin = createAdminClient();

  // 2. All open orders that have already been accepted by a supplier.
  const { data, error } = await admin
    .from("orders")
    .select("id, supplier_id, supplier_order_id, status, start_count, remains")
    .in("status", OPEN_STATUSES)
    .not("supplier_order_id", "is", null)
    .order("id", { ascending: true })
    .limit(MAX_ORDERS_PER_RUN);

  if (error) {
    // 500 makes QStash retry (and retries count as messages), but a DB outage deserves it.
    console.error("[checkstatus] db read failed:", error.message);
    return NextResponse.json({ error: "db_read_failed" }, { status: 500 });
  }

  const orders = (data ?? []) as OrderRow[];

  // 3. Group by supplier.
  const bySupplier = new Map<number, OrderRow[]>();
  for (const o of orders) {
    const list = bySupplier.get(o.supplier_id) ?? [];
    list.push(o);
    bySupplier.set(o.supplier_id, list);
  }

  const stats = { open: orders.length, checked: 0, updated: 0, finalized: 0, skipped: 0, errors: 0 };

  // 4. One supplier request per chunk of up to 100 orders.
  for (const [supplierId, rows] of bySupplier) {
    let supplier;
    try {
      supplier = await getSupplier(supplierId);
    } catch (e) {
      console.error(`[checkstatus] supplier ${supplierId}:`, errMsg(e));
      stats.errors += rows.length;
      continue;
    }

    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const chunk = rows.slice(i, i + BATCH_SIZE);

      let results;
      try {
        results = await getStatuses(
          supplier,
          chunk.map((r) => r.supplier_order_id),
        );
      } catch (e) {
        // Whole request failed: leave these orders as they are, retry next run.
        console.error(`[checkstatus] ${supplier.slug} batch failed:`, errMsg(e));
        stats.errors += chunk.length;
        continue;
      }

      for (const row of chunk) {
        stats.checked++;
        const r = results[row.supplier_order_id];

        if (!r || !r.ok) {
          stats.errors++;
          console.warn(
            `[checkstatus] order ${row.id} (${supplier.slug} #${row.supplier_order_id}):`,
            r && !r.ok ? r.error : "no result",
          );
          continue;
        }

        const status = mapSupplierStatus(r.status);
        if (!status) {
          stats.skipped++;
          console.warn(`[checkstatus] order ${row.id}: unknown supplier status "${r.status}"`);
          continue;
        }

        try {
          if (isFinal(status)) {
            // A partial without a remains figure would refund nothing, so wait for a clean reply.
            if (status === "partial" && r.remains === null) {
              stats.skipped++;
              console.warn(`[checkstatus] order ${row.id}: partial without remains, skipping`);
              continue;
            }
            const { error: rpcError } = await admin.rpc("finalize_order", {
              p_order: row.id,
              p_status: status,
              p_start_count: r.startCount,
              p_remains: r.remains,
              p_error: null,
            });
            if (rpcError) throw new Error(rpcError.message);
            stats.finalized++;
          } else {
            const nextStart = r.startCount ?? row.start_count;
            const nextRemains = r.remains ?? row.remains;
            const changed =
              status !== row.status ||
              nextStart !== row.start_count ||
              nextRemains !== row.remains;
            if (!changed) continue;

            // Guard with .in(...) so we never overwrite an order that just became final.
            const { error: updError } = await admin
              .from("orders")
              .update({ status, start_count: nextStart, remains: nextRemains })
              .eq("id", row.id)
              .in("status", OPEN_STATUSES);
            if (updError) throw new Error(updError.message);
            stats.updated++;
          }
        } catch (e) {
          stats.errors++;
          console.error(`[checkstatus] order ${row.id} update failed:`, errMsg(e));
        }
      }
    }
  }

  // Always 200 once we got this far, so per-order problems don't trigger QStash retries.
  return NextResponse.json({ ok: true, ...stats });
}
