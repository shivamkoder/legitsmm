/**
 * Supplier API keys.
 *
 * The `suppliers` table has a column `api_key_env` (e.g. "NICESMM_API_KEY").
 * That value is the NAME we look up here. Lookup order:
 *   1. A real environment variable with that name (Vercel -> Settings -> Environment Variables)
 *   2. The fallback map below (paste keys directly for now)
 *
 * SECURITY: anything pasted below is committed to Git. Keep the repo PRIVATE,
 * and move the keys to Vercel env vars as soon as you can (then empty the
 * strings here). If a key ever lands in a public repo, rotate it at the supplier.
 *
 * Server only. Never import this file from a "use client" component.
 */
const FALLBACK_KEYS: Record<string, string> = {
  NICESMM_API_KEY: "PASTE_NICESMM_KEY_HERE",
  MORETHANPANEL_API_KEY: "PASTE_MORETHANPANEL_KEY_HERE",
};

export function resolveSupplierKey(envName: string): string | null {
  const fromEnv = process.env[envName];
  if (fromEnv && fromEnv.trim()) return fromEnv.trim();

  const pasted = FALLBACK_KEYS[envName];
  if (pasted && pasted.trim() && !pasted.startsWith("PASTE_")) return pasted.trim();

  return null;
}
