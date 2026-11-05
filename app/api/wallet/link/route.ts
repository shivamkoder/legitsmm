import { NextResponse } from "next/server";
import { createPublicClient, getAddress, http, isAddress } from "viem";
import { polygon } from "viem/chains";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const maxDuration = 30;

const MAX_WALLETS = 5;
const MAX_AGE_MS = 10 * 60 * 1000;

const buildMessage = (userId: string, address: string, issued: string) =>
  `Link wallet to Legit SMM\nUser: ${userId}\nAddress: ${address}\nIssued: ${issued}`;

async function currentUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  return (data?.claims?.sub as string | undefined) ?? null;
}

const treasury = () => process.env.TREASURY_WALLET_ADDRESS ?? null;

// Returns whether the wallet is linked, and a message to sign if it isn't.
export async function GET(req: Request) {
  const userId = await currentUser();
  if (!userId) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const raw = new URL(req.url).searchParams.get("address") ?? "";
  if (!isAddress(raw)) return NextResponse.json({ error: "Invalid address." }, { status: 400 });
  const address = getAddress(raw);

  const admin = createAdminClient();
  const { data } = await admin
    .from("wallet_links")
    .select("user_id")
    .eq("chain", "evm")
    .eq("address", address)
    .maybeSingle();

  if (data && data.user_id !== userId) {
    return NextResponse.json({ error: "This wallet is linked to another account." }, { status: 409 });
  }

  return NextResponse.json({
    linked: !!data,
    treasury: treasury(),
    message: data ? undefined : buildMessage(userId, address, new Date().toISOString()),
  });
}

export async function POST(req: Request) {
  const userId = await currentUser();
  if (!userId) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const rawAddr = String(body?.address ?? "");
  const message = String(body?.message ?? "");
  const signature = String(body?.signature ?? "") as `0x${string}`;
  if (!isAddress(rawAddr) || !message || !signature.startsWith("0x")) {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }
  const address = getAddress(rawAddr);

  // The message must be exactly what we issue: this user, this address, fresh.
  const m = message.match(/^Link wallet to Legit SMM\nUser: (.+)\nAddress: (.+)\nIssued: (.+)$/);
  const issuedAt = m ? Date.parse(m[3]) : NaN;
  if (
    !m ||
    m[1] !== userId ||
    m[2] !== address ||
    !Number.isFinite(issuedAt) ||
    Date.now() - issuedAt > MAX_AGE_MS ||
    issuedAt - Date.now() > 60_000
  ) {
    return NextResponse.json({ error: "Signing request expired. Try again." }, { status: 400 });
  }

  // viem's public-client verifyMessage also accepts smart-contract wallets (ERC-1271).
  const client = createPublicClient({ chain: polygon, transport: http(process.env.POLYGON_RPC_URL || undefined) });
  const valid = await client.verifyMessage({ address, message, signature }).catch(() => false);
  if (!valid) return NextResponse.json({ error: "Signature does not match this wallet." }, { status: 400 });

  const admin = createAdminClient();
  const { data: existing } = await admin
    .from("wallet_links")
    .select("user_id")
    .eq("chain", "evm")
    .eq("address", address)
    .maybeSingle();
  if (existing) {
    return existing.user_id === userId
      ? NextResponse.json({ success: true })
      : NextResponse.json({ error: "This wallet is linked to another account." }, { status: 409 });
  }

  const { count } = await admin
    .from("wallet_links")
    .select("address", { count: "exact", head: true })
    .eq("user_id", userId);
  if ((count ?? 0) >= MAX_WALLETS) {
    return NextResponse.json({ error: `You can link up to ${MAX_WALLETS} wallets.` }, { status: 400 });
  }

  const { error } = await admin.from("wallet_links").insert({ user_id: userId, chain: "evm", address });
  if (error) {
    // Primary key (chain, address) hit: someone linked it between our check and insert.
    return NextResponse.json({ error: "Could not link this wallet." }, { status: 409 });
  }
  return NextResponse.json({ success: true });
}
