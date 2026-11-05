import { NextResponse } from "next/server";
import { createPublicClient, http, parseEventLogs, erc20Abi, formatUnits, getAddress } from "viem";
import { polygon, bsc } from "viem/chains";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const CHAINS = {
  polygon: { chain: polygon, rpc: process.env.POLYGON_RPC_URL!, confirmations: 30,
    tokens: [{ address: "0x...USDT", decimals: 6 }, { address: "0x...USDC", decimals: 6 }] },
  bsc: { chain: bsc, rpc: process.env.BSC_RPC_URL!, confirmations: 15,
    tokens: [{ address: "0x...USDT", decimals: 18 }] },
} as const;

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  const userId = auth?.claims?.sub;
  if (!userId) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const { chain: chainKey, txHash } = await req.json();
  const cfg = CHAINS[chainKey as keyof typeof CHAINS];
  if (!cfg || !/^0x[0-9a-fA-F]{64}$/.test(txHash))
    return NextResponse.json({ error: "Bad request." }, { status: 400 });

  const admin = createAdminClient();
  const { data: links } = await admin.from("wallet_links")
    .select("address").eq("user_id", userId).eq("chain", "evm");
  const linked = (links ?? []).map((l) => getAddress(l.address));

  const client = createPublicClient({ chain: cfg.chain, transport: http(cfg.rpc) });
  const receipt = await client.getTransactionReceipt({ hash: txHash }).catch(() => null);
  if (!receipt || receipt.status !== "success")
    return NextResponse.json({ error: "Transaction not found or failed." }, { status: 400 });

  const head = await client.getBlockNumber();
  if (head - receipt.blockNumber < BigInt(cfg.confirmations))
    return NextResponse.json({ error: "Not enough confirmations yet." }, { status: 409 });

  const treasury = getAddress(process.env.TREASURY_WALLET_ADDRESS!);
  const logs = parseEventLogs({ abi: erc20Abi, eventName: "Transfer", logs: receipt.logs });
  const hit = logs.find((l) => {
    const t = cfg.tokens.find((t) => getAddress(t.address) === getAddress(l.address));
    return t && getAddress(l.args.to) === treasury && linked.includes(getAddress(l.args.from));
  });
  if (!hit) return NextResponse.json({ error: "No matching deposit found." }, { status: 400 });

  const token = cfg.tokens.find((t) => getAddress(t.address) === getAddress(hit.address))!;
  const amount = Number(formatUnits(hit.args.value, token.decimals));

  const { error } = await admin.rpc("credit_crypto_deposit", {
    p_user: userId, p_chain: chainKey, p_tx: txHash, p_amount: amount,
  });
  if (error?.message.includes("duplicate"))
    return NextResponse.json({ error: "Already credited." }, { status: 409 });
  if (error) return NextResponse.json({ error: "Could not credit." }, { status: 500 });

  return NextResponse.json({ success: true, credited: amount });
}
