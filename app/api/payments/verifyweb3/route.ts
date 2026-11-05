import { NextResponse } from "next/server";
import { createPublicClient, erc20Abi, formatUnits, getAddress, http, parseEventLogs } from "viem";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { CHAIN_KEYS, WEB3_CHAINS, type ChainKey } from "@/lib/web3/config";
import { bsc, polygon } from "viem/chains";

export const maxDuration = 30;

const CHAIN_OBJ = { polygon, bsc } as const;
const RPC: Record<ChainKey, string | undefined> = {
  polygon: process.env.POLYGON_RPC_URL || undefined,
  bsc: process.env.BSC_RPC_URL || undefined,
};

const fail = (status: number, error: string, code?: string) =>
  NextResponse.json({ error, code }, { status });

export async function POST(req: Request) {
  // 1. User comes from the session, never from the body.
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  const userId = auth?.claims?.sub as string | undefined;
  if (!userId) return fail(401, "Not authenticated.");

  // 2. Validate input.
  const body = await req.json().catch(() => null);
  const chainKey = body?.chain as ChainKey;
  const txHash = String(body?.txHash ?? "").toLowerCase() as `0x${string}`;
  if (!CHAIN_KEYS.includes(chainKey) || !/^0x[0-9a-f]{64}$/.test(txHash)) {
    return fail(400, "Bad request.");
  }
  const cfg = WEB3_CHAINS[chainKey];
  if (!process.env.TREASURY_WALLET_ADDRESS) return fail(500, "Deposits are not configured.");
  const treasury = getAddress(process.env.TREASURY_WALLET_ADDRESS);

  const admin = createAdminClient();

  // 3. Cheap replay check before spending an RPC call.
  const { data: seen } = await admin
    .from("crypto_deposits")
    .select("id")
    .eq("chain", chainKey)
    .eq("tx_hash", txHash)
    .maybeSingle();
  if (seen) return fail(409, "Already credited.", "duplicate");

  // 4. Wallets this user has proven they own.
  const { data: links } = await admin
    .from("wallet_links")
    .select("address")
    .eq("user_id", userId)
    .eq("chain", "evm");
  const linked = new Set((links ?? []).map((l) => getAddress(l.address)));
  if (linked.size === 0) return fail(403, "Link a wallet first.");

  // 5. Read the transaction from chain.
  const client = createPublicClient({ chain: CHAIN_OBJ[chainKey], transport: http(RPC[chainKey]) });
  const receipt = await client.getTransactionReceipt({ hash: txHash }).catch(() => null);
  if (!receipt) return fail(409, "Transaction not found yet.", "confirming");
  if (receipt.status !== "success") return fail(400, "Transaction failed on-chain.");

  const head = await client.getBlockNumber();
  if (head - receipt.blockNumber < BigInt(cfg.confirmations)) {
    return fail(409, "Waiting for confirmations.", "confirming");
  }

  // 6. Add up stablecoin transfers: whitelisted token -> our treasury, from a linked wallet.
  const logs = parseEventLogs({ abi: erc20Abi, eventName: "Transfer", logs: receipt.logs });
  let amount = 0;
  for (const l of logs) {
    const token = cfg.tokens.find((t) => getAddress(t.address) === getAddress(l.address));
    if (!token) continue;
    if (getAddress(l.args.to) !== treasury) continue;
    if (!linked.has(getAddress(l.args.from))) continue;
    amount += Number(formatUnits(l.args.value, token.decimals));
  }
  if (amount <= 0) {
    return fail(400, "No deposit from your linked wallet was found in this transaction.");
  }
  amount = Math.floor(amount * 1e6) / 1e6;

  // 7. Atomic credit. The unique (chain, tx_hash) key is the final double-credit guard.
  const { error } = await admin.rpc("credit_crypto_deposit", {
    p_user: userId,
    p_chain: chainKey,
    p_tx: txHash,
    p_amount: amount,
  });
  if (error) {
    if (error.message.includes("duplicate")) return fail(409, "Already credited.", "duplicate");
    console.error("[verify-web3] credit failed:", error.message);
    return fail(500, "Could not credit your balance. Contact support with your transaction hash.");
  }

  return NextResponse.json({ success: true, credited: amount });
}
