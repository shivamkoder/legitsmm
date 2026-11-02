import { createAdminClient } from "@/lib/supabase/admin";
import { getServices, type Supplier } from "@/lib/suppliers/client";

export type SyncResult =
  | { supplier: string; ok: true; fetched: number; stats: unknown }
  | { supplier: string; ok: false; error: string };

/**
 * Pulls one supplier's catalog and hands it to the apply_catalog_sync SQL
 * function, which does all the writes in a single transaction.
 */
export async function syncSupplierCatalog(
  supplier: Supplier,
  opts: { markup: number; spike: number },
): Promise<SyncResult> {
  try {
    const services = await getServices(supplier);

    // Drop anything that would poison the database (NaN rates, missing ids).
    const items = services
      .filter(
        (s) =>
          s.service !== "" &&
          s.service !== "undefined" &&
          Number.isFinite(s.rate) &&
          s.rate >= 0 &&
          Number.isFinite(s.min) &&
          Number.isFinite(s.max),
      )
      .map((s) => ({
        service: s.service,
        name: s.name,
        category: s.category,
        type: s.type,
        rate: s.rate,
        min_qty: Math.trunc(s.min),
        max_qty: Math.trunc(s.max),
        refill: s.refill,
        cancel: s.cancel,
      }));

    if (items.length === 0) throw new Error("Supplier returned no usable services");

    const admin = createAdminClient();
    const { data, error } = await admin.rpc("apply_catalog_sync", {
      p_supplier: supplier.id,
      p_items: items,
      p_markup: opts.markup,
      p_spike: opts.spike,
    });
    if (error) throw new Error(error.message);

    await admin
      .from("suppliers")
      .update({ last_synced_at: new Date().toISOString() })
      .eq("id", supplier.id);

    return { supplier: supplier.slug, ok: true, fetched: items.length, stats: data };
  } catch (e) {
    return {
      supplier: supplier.slug,
      ok: false,
      error: e instanceof Error ? e.message : String(e),
    };
  }
}
