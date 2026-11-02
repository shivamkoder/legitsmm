import { Receiver } from "@upstash/qstash";
import type { NextRequest } from "next/server";

/**
 * True only if the request was really sent by QStash.
 * Built inside the function so missing env vars give a 401 at request time
 * instead of crashing `next build`.
 */
export async function verifyQStash(req: NextRequest): Promise<boolean> {
  const body = await req.text();
  const receiver = new Receiver({
    currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY ?? "",
    nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY ?? "",
  });
  return receiver
    .verify({ signature: req.headers.get("upstash-signature") ?? "", body })
    .catch(() => false);
}
