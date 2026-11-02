import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyQStash } from "@/lib/qstash";
import { syncSupplierCatalog } from "@/lib/suppliers/sync";
import type { Supplier } from "@/lib/suppliers/client";

// No `export const dynamic` here: not allowed with cacheComponents: true.
export const maxDuration = 60;

const num = (v: string | undefined, fallback: number) => {
  const n = Number(v);
  return v !== undefined && v !== "" && Number.isFinite(n) ? n : fallback;
};

export async function POST(req: NextRequest) {
  if (!(await verifyQStash(req))) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const markup = num(process.env.SYNC_MARKUP_PERCENT, 21); // default retail markup %
  const spike = num(process.env.SYNC_SPIKE_PERCENT, 15); // cost jump % that hides a service

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("suppliers")
    .select("id, slug, name, api_url, api_key_env")
    .eq("is_active", true);

  if (error) {
    console.error("[sync-catalog] suppliers read failed:", error.message);
    return NextResponse.json({ error: "db_read_failed" }, { status: 500 });
  }

  // One supplier failing must not stop the other, so run them independently.
  const results = [];
  for (const supplier of (data ?? []) as Supplier[]) {
    const result = await syncSupplierCatalog(supplier, { markup, spike });
    if (!result.ok) console.error(`[sync-catalog] ${supplier.slug}:`, result.error);
    results.push(result);
  }

  // Always 200 so per-supplier failures don't trigger QStash retries (they count as messages).
  return NextResponse.json({ ok: true, results });
}
