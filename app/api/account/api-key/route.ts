import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateApiKey } from "@/lib/api-key";

async function getAuthenticatedUserId(): Promise<string | null> {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  return auth?.claims?.sub ?? null;
}

/**
 * GET /api/account/api-key
 * Returns whether the signed-in user has an active API key and its masked prefix.
 */
export async function GET() {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("profiles")
    .select("api_key_prefix")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("[api-key] GET failed:", error.message);
    return NextResponse.json({ error: "Could not fetch API key status." }, { status: 500 });
  }

  return NextResponse.json({
    hasKey: Boolean(data?.api_key_prefix),
    prefix: data?.api_key_prefix ?? null,
  });
}

/**
 * POST /api/account/api-key
 * Generates or regenerates the signed-in user's API key.
 * Returns the plaintext key ONCE — only the SHA-256 hash is persisted.
 */
export async function POST() {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { plaintext, hash, prefix } = generateApiKey();
  const admin = createAdminClient();

  const { error } = await admin
    .from("profiles")
    .update({
      api_key_hash: hash,
      api_key_prefix: prefix,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) {
    console.error("[api-key] POST failed:", error.message);
    return NextResponse.json({ error: "Could not generate API key." }, { status: 500 });
  }

  return NextResponse.json({
    apiKey: plaintext,
    prefix,
  });
}

/**
 * DELETE /api/account/api-key
 * Revokes the signed-in user's API key immediately.
 */
export async function DELETE() {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("profiles")
    .update({
      api_key_hash: null,
      api_key_prefix: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) {
    console.error("[api-key] DELETE failed:", error.message);
    return NextResponse.json({ error: "Could not revoke API key." }, { status: 500 });
  }

  return NextResponse.json({ revoked: true });
}
