import { createClient } from "@supabase/supabase-js";

const MARKUP = Number(process.env.SYNC_MARKUP_PERCENT ?? 21);
const SLUG = process.argv[2] ?? "nicesmm";

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

const PLATFORMS: [string, RegExp][] = [
  ["instagram", /instagram|\big\b/],
  ["youtube", /youtube|\byt\b/],
  ["tiktok", /tiktok/],
  ["telegram", /telegram/],
  ["facebook", /facebook|\bfb\b/],
  ["x", /twitter|\bx\b|tweet/],
  ["spotify", /spotify/],
  ["twitch", /twitch/],
];

const detectPlatform = (text: string) =>
  PLATFORMS.find(([, re]) => re.test(text.toLowerCase()))?.[0] ?? "other";

async function main() {
  const { data: supplier, error } = await admin
    .from("suppliers").select("*").eq("slug", SLUG).single();
  if (error || !supplier) throw new Error(`Supplier ${SLUG} not found`);

  const key = process.env[supplier.api_key_env];
  if (!key) throw new Error(`Missing env ${supplier.api_key_env}`);

  const res = await fetch(supplier.api_url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ key, action: "services" }),
    signal: AbortSignal.timeout(60_000),
  });
  const list = await res.json();
  if (!Array.isArray(list)) throw new Error(`Bad reply: ${JSON.stringify(list).slice(0, 200)}`);
  console.log(`Fetched ${list.length} services from ${supplier.name}`);

  const items = list
    .map((s: any) => ({
      id: String(s.service),
      name: String(s.name ?? ""),
      category: String(s.category ?? "Other"),
      type: String(s.type ?? "Default"),
      cost: Number(s.rate),
      min: Math.trunc(Number(s.min)),
      max: Math.trunc(Number(s.max)),
      refill: Boolean(s.refill),
      cancel: Boolean(s.cancel),
    }))
    .filter((s) => s.id && Number.isFinite(s.cost) && s.cost >= 0 &&
                   Number.isFinite(s.min) && Number.isFinite(s.max));

  const CHUNK = 500;
  for (let i = 0; i < items.length; i += CHUNK) {
    const chunk = items.slice(i, i + CHUNK);

    // is_active is left out on purpose, so a service you hid stays hidden.
    const { data: rows, error: e1 } = await admin
      .from("services")
      .upsert(
        chunk.map((s) => ({
          source_key: `${supplier.slug}:${s.id}`,
          platform: detectPlatform(`${s.category} ${s.name}`),
          category: s.category,
          name: s.name,
          type: s.type,
          rate: Number((s.cost * (1 + MARKUP / 100)).toFixed(4)),
          min_qty: s.min,
          max_qty: s.max,
          refill: s.refill,
          cancel: s.cancel,
          updated_at: new Date().toISOString(),
        })),
        { onConflict: "source_key" },
      )
      .select("id, source_key");
    if (e1) throw new Error(e1.message);

    const idByKey = new Map(rows!.map((r) => [r.source_key, r.id]));
    const { error: e2 } = await admin.from("service_suppliers").upsert(
      chunk.map((s) => ({
        service_id: idByKey.get(`${supplier.slug}:${s.id}`)!,
        supplier_id: supplier.id,
        supplier_service_id: s.id,
        cost_rate: s.cost,
      })),
      { onConflict: "service_id,supplier_id" },
    );
    if (e2) throw new Error(e2.message);
    console.log(`  saved ${Math.min(i + CHUNK, items.length)}/${items.length}`);
  }

  await admin.from("suppliers")
    .update({ last_synced_at: new Date().toISOString() }).eq("id", supplier.id);
  console.log("Done.");
}

main().catch((e) => { console.error(e); process.exit(1); });
