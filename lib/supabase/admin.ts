import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client. Bypasses RLS, so use it ONLY in server code
 * (route handlers, jobs). Never import this file from a "use client" component.
 *
 * Create it inside the function that needs it, not at module top level,
 * so a missing env var can't crash `next build`.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
