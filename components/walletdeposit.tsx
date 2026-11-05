"use client";

import React, { useEffect, useState } from "react";
import { useAccount, useConfig, useDisconnect, useSignMessage, useSwitchChain, useWriteContract } from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";
import { useAppKit } from "@reown/appkit/react";
import { erc20Abi, parseUnits, type Address } from "viem";
import { CheckCircle2, Link2, Loader2, Send, Wallet } from "lucide-react";
import { Web3Provider, web3Ready } from "@/lib/web3/provider";
import { CHAIN_KEYS, WEB3_CHAINS, type ChainKey } from "@/lib/web3/config";

const card = "rounded-2xl border border-[#7FFF00]/15 bg-[#050a02]";
const field =
  "flex w-full items-center rounded-xl border border-[#7FFF00]/15 bg-black/40 text-[13px] text-white/90 transition-colors focus-within:border-[#7FFF00]/40";
const primaryBtn =
  "flex w-full items-center justify-center gap-2 rounded-xl bg-[#7FFF00] py-3.5 text-[13px] font-semibold text-black transition-colors hover:bg-[#7FFF00]/85 disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-[#7FFF00]/60";
const pill = (on: boolean) =>
  `rounded-xl border px-4 py-2.5 text-[13px] transition-colors outline-none focus-visible:ring-1 focus-visible:ring-[#7FFF00]/60 ${
    on
      ? "border-[#7FFF00]/50 bg-[#7FFF00]/10 text-[#7FFF00]"
      : "border-[#7FFF00]/15 bg-black/40 text-white/80 hover:border-[#7FFF00]/30"
  }`;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const short = (a: string) => `${a.slice(0, 6)}...${a.slice(-4)}`;

type Pending = { hash: string; chain: ChainKey };

function WalletDepositInner() {
  const config = useConfig();
  const { open } = useAppKit();
  const { address, isConnected, chainId } = useAccount();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();

  const [chainKey, setChainKey] = useState<ChainKey>("polygon");
  const [symbol, setSymbol] = useState("USDT");
  const [amount, setAmount] = useState("");
  const [linked, setLinked] = useState<boolean | null>(null);
  const [linkMsg, setLinkMsg] = useState("");
  const [treasury, setTreasury] = useState<Address | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [credited, setCredited] = useState<number | null>(null);
  const [pending, setPending] = useState<Pending | null>(null);

  const cfg = WEB3_CHAINS[chainKey];
  const token = cfg.tokens.find((t) => t.symbol === symbol) ?? cfg.tokens[0];

  // Ask the server whether this wallet is already linked to the account.
  useEffect(() => {
    setLinked(null);
    setError(null);
    if (!address) return;
    let off = false;
    fetch(`/api/wallet/link?address=${address}`)
      .then((r) => r.json())
      .then((j) => {
        if (off) return;
        if (j.error) return setError(j.error);
        setLinked(j.linked);
        setLinkMsg(j.message ?? "");
        setTreasury(j.treasury ?? null);
      })
      .catch(() => !off && setError("Could not check your wallet. Try again."));
    return () => {
      off = true;
    };
  }, [address]);

  const run = async (label: string, fn: () => Promise<void>) => {
    setError(null);
    setBusy(label);
    try {
      await fn();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong.";
      setError(/user rejected|denied/i.test(msg) ? "You cancelled the request in your wallet." : msg.split("\n")[0]);
    } finally {
      setBusy(null);
    }
  };

  const linkWallet = () =>
    run("Waiting for signature...", async () => {
      const signature = await signMessageAsync({ message: linkMsg });
      const r = await fetch("/api/wallet/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, message: linkMsg, signature }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error ?? "Could not link wallet.");
      setLinked(true);
    });

  // The server re-checks everything. 409 "confirming" just means: ask again soon.
  const verify = async (p: Pending) => {
    for (let i = 0; i < 24; i++) {
      const r = await fetch("/api/payment/verify-web3", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chain: p.chain, txHash: p.hash }),
      });
      const j = await r.json().catch(() => ({}));
      if (r.ok) {
        setCredited(j.credited);
        setPending(null);
        return;
      }
      if (j.code === "confirming") {
        await sleep(5000);
        continue;
      }
      if (j.code === "duplicate") {
        setPending(null);
        throw new Error("This transaction was already credited.");
      }
      throw new Error(j.error ?? "Verification failed.");
    }
    throw new Error("Still waiting for confirmations. Use Retry in a minute.");
  };

  const pay = () =>
    run("Confirm in your wallet...", async () => {
      const value = Number(amount);
      if (!treasury) throw new Error("Deposit address unavailable. Refresh and try again.");
      if (!Number.isFinite(value) || value < 1) throw new Error("Minimum deposit is $1.");
      setCredited(null);

      if (chainId !== cfg.id) await switchChainAsync({ chainId: cfg.id });
      const hash = await writeContractAsync({
        address: token.address,
        abi: erc20Abi,
        functionName: "transfer",
        args: [treasury, parseUnits(amount, token.decimals)],
        chainId: cfg.id,
      });
      const p = { hash, chain: chainKey };
      setPending(p);

      setBusy("Waiting for the network...");
      await waitForTransactionReceipt(config, { hash, chainId: cfg.id });
      setBusy("Crediting your balance...");
      await verify(p);
    });

  const retry = () =>
    pending &&
    run("Checking transaction...", async () => {
      await verify(pending);
    });

  return (
    <div className={`${card} p-5 md:p-6`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#7FFF00]/25 bg-[#7FFF00]/10">
            <Wallet className="h-5 w-5 text-[#7FFF00]" strokeWidth={1.5} />
          </span>
          <div>
            <h3 className="text-[15px] font-semibold text-white">Pay from your wallet</h3>
            <p className="text-[12px] text-white/50">MetaMask, Phantom, Trust, Coinbase Wallet and more</p>
          </div>
        </div>
        {isConnected && address && (
          <button
            type="button"
            onClick={() => disconnect()}
            className="rounded-lg border border-[#7FFF00]/20 px-3 py-1.5 text-[12px] text-white/70 hover:text-white"
            title="Disconnect"
          >
            {short(address)}
          </button>
        )}
      </div>

      <div className="mt-5 flex flex-col gap-5">
        {!isConnected ? (
          <button type="button" onClick={() => open()} className={primaryBtn}>
            <Wallet className="h-4 w-4" /> Connect wallet
          </button>
        ) : linked === false ? (
          <div className="rounded-xl border border-dashed border-[#7FFF00]/25 bg-black/30 p-4">
            <p className="text-[13px] text-white/80">
              Link this wallet to your account first. You sign a free message (no gas). Only deposits sent from a
              linked wallet are credited to you.
            </p>
            <button type="button" onClick={linkWallet} disabled={!!busy} className={`${primaryBtn} mt-4`}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />}
              {busy ?? "Link wallet"}
            </button>
          </div>
        ) : linked === null && !error ? (
          <p className="flex items-center gap-2 text-[13px] text-white/60">
            <Loader2 className="h-4 w-4 animate-spin" /> Checking your wallet...
          </p>
        ) : linked ? (
          <>
            <div>
              <p className="mb-2 text-[13px] font-medium text-white">Network</p>
              <div className="flex flex-wrap gap-2.5">
                {CHAIN_KEYS.map((k) => (
                  <button
                    key={k}
                    type="button"
                    aria-pressed={chainKey === k}
                    onClick={() => {
                      setChainKey(k);
                      setSymbol("USDT");
                    }}
                    className={pill(chainKey === k)}
                  >
                    {WEB3_CHAINS[k].label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-[13px] font-medium text-white">Token</p>
              <div className="flex flex-wrap gap-2.5">
                {cfg.tokens.map((t) => (
                  <button
                    key={t.symbol}
                    type="button"
                    aria-pressed={token.symbol === t.symbol}
                    onClick={() => setSymbol(t.symbol)}
                    className={pill(token.symbol === t.symbol)}
                  >
                    {t.symbol}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-[13px] font-medium text-white">Amount</p>
              <div className={`${field} px-4`}>
                <span className="text-white/40">$</span>
                <input
                  type="number"
                  inputMode="decimal"
                  min={1}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-transparent px-2 py-3.5 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <span className="text-white/40">{token.symbol}</span>
              </div>
              <p className="mt-1.5 text-xs text-white/40">Min: $1. Credited 1:1 in USD after network confirmations.</p>
            </div>

            <button type="button" onClick={pay} disabled={!!busy || !amount} className={primaryBtn}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {busy ?? `Send ${token.symbol}`}
            </button>
          </>
        ) : null}

        {pending && !busy && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-yellow-500/25 bg-yellow-500/[0.05] p-3.5 text-[12px] text-yellow-300">
            <span className="min-w-0 truncate">Payment sent ({short(pending.hash)}) but not credited yet.</span>
            <button
              type="button"
              onClick={retry}
              className="shrink-0 rounded-lg bg-yellow-400 px-3 py-1.5 font-semibold text-black"
            >
              Retry
            </button>
          </div>
        )}

        {credited !== null && (
          <p className="flex items-center gap-2 text-[13px] font-medium text-[#7FFF00]">
            <CheckCircle2 className="h-4 w-4" /> ${credited.toFixed(2)} added to your balance.
          </p>
        )}
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    </div>
  );
}

export default function WalletDeposit() {
  if (!web3Ready) {
    return (
      <div className={`${card} p-5 text-[13px] text-white/60`}>
        Wallet payments are not configured yet. Set NEXT_PUBLIC_REOWN_PROJECT_ID.
      </div>
    );
  }
  return (
    <Web3Provider>
      <WalletDepositInner />
    </Web3Provider>
  );
}
