import { createAdminClient } from "@/lib/supabase/admin";
import { syncSupplierCatalog } from "@/lib/suppliers/sync";
import type { Supplier } from "@/lib/suppliers/client";

async function main() {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("suppliers")
    .select("id, slug, name, api_url, api_key_env")
    .eq("is_active", true);
  if (error) throw new Error(error.message);

  for (const s of (data ?? []) as Supplier[]) {
    const r = await syncSupplierCatalog(s, { markup: 21, spike: 15 });
    console.log(JSON.stringify(r, null, 2));
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
