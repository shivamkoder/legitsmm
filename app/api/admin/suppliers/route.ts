import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getBalance, type Supplier } from "@/lib/suppliers/client";
import { resolveSupplierKey } from "@/lib/suppliers/keys";
import { syncSupplierCatalog } from "@/lib/suppliers/sync";

export const maxDuration = 60;

// Only these signed-in emails can use this route. Put YOUR login email here.
const ADMIN_EMAILS = ["shivamkumar210107@gmail.com"];

/**
 * Open while signed in as an admin:
 *   /api/admin/suppliers                              -> test every supplier (key found? balance?)
 *   /api/admin/suppliers?action=sync                  -> sync every active supplier's catalog
 *   /api/admin/suppliers?action=sync&supplier=nicesmm -> sync just one (safer for the 60s limit)
 *   /api/admin/suppliers?supplier=morethanpanel       -> test just one
 */
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  const email = String(auth?.claims?.email ?? "").toLowerCase();
  if (!email || !ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const action = req.nextUrl.searchParams.get("action") ?? "test";
  const only = req.nextUrl.searchParams.get("supplier");

  const admin = createAdminClient();
  let query = admin
    .from("suppliers")
    .select("id, slug, name, api_url, api_key_env, is_active");
  if (only) query = query.eq("slug", only);
  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: `suppliers read failed: ${error.message}` }, { status: 500 });
  }
  if (!data || data.length === 0) {
    return NextResponse.json(
      { error: "No supplier rows found. Insert them into the suppliers table first." },
      { status: 404 },
    );
  }

  const results = [];
  for (const row of data) {
    const supplier = row as Supplier & { is_active: boolean };

    if (action === "sync") {
      const markup = Number(process.env.SYNC_MARKUP_PERCENT ?? 21);
      const spike = Number(process.env.SYNC_SPIKE_PERCENT ?? 15);
      results.push(await syncSupplierCatalog(supplier, { markup, spike }));
      continue;
    }

    // action === "test"
    const keyFound = !!resolveSupplierKey(supplier.api_key_env);
    if (!keyFound) {
      results.push({
        supplier: supplier.slug,
        ok: false,
        keyFound,
        error: `No key for "${supplier.api_key_env}". Paste it in lib/suppliers/keys.ts or set that env var.`,
      });
      continue;
    }
    try {
      const b = await getBalance(supplier);
      results.push({ supplier: supplier.slug, ok: true, keyFound, url: supplier.api_url, ...b });
    } catch (e) {
      results.push({
        supplier: supplier.slug,
        ok: false,
        keyFound,
        url: supplier.api_url,
        error: e instanceof Error ? e.message : String(e),
      });
    }
  }

  return NextResponse.json({ action, results });
}
