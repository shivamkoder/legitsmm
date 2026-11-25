"use client";

import React from "react";
import {
  Coins,
  Gift,
  Sparkles,
  TrendingUp,
  Wallet,
  ArrowRight,
  Award,
} from "lucide-react";

const card = "rounded-2xl border border-[#7FFF00]/15 bg-[#050a02]";

export function Earn({
  points = 0,
  balance = 0,
  status = "New",
  onNavigate,
}: {
  points?: number;
  balance?: number;
  status?: string;
  onNavigate?: (id: string) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`${card} p-5 md:p-6`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#7FFF00]/25 bg-[#7FFF00]/10 text-[#7FFF00]">
              <Coins className="h-5 w-5" strokeWidth={1.6} />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-[#7FFF00]">Earn</h1>
              <p className="mt-0.5 text-sm text-[#7FFF00]/65">
                Track your reward points, deposit bonuses, and upcoming ways to earn free panel balance.
              </p>
            </div>
          </div>

          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#7FFF00]/25 bg-[#7FFF00]/10 px-3 py-1 text-xs font-medium text-[#7FFF00]">
            <Sparkles className="h-3.5 w-3.5" />
            Tier: {status}
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className={`${card} p-5`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-[#7FFF00]/60">
              Reward Points
            </span>
            <Gift className="h-4 w-4 text-[#7FFF00]/70" strokeWidth={1.5} />
          </div>
          <p className="mt-3 text-2xl font-semibold text-[#7FFF00]">
            {Number(points).toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-[#7FFF00]/50">
            Accumulated points from panel activity
          </p>
        </div>

        <div className={`${card} p-5`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-[#7FFF00]/60">
              Available Balance
            </span>
            <Wallet className="h-4 w-4 text-[#7FFF00]/70" strokeWidth={1.5} />
          </div>
          <p className="mt-3 text-2xl font-semibold text-[#7FFF00]">
            ${Number(balance).toFixed(2)}
          </p>
          <p className="mt-1 text-xs text-[#7FFF00]/50">
            Ready to spend on any service
          </p>
        </div>

        <div className={`${card} p-5`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-[#7FFF00]/60">
              Account Status
            </span>
            <Award className="h-4 w-4 text-[#7FFF00]/70" strokeWidth={1.5} />
          </div>
          <p className="mt-3 text-2xl font-semibold text-[#7FFF00]">{status}</p>
          <p className="mt-1 text-xs text-[#7FFF00]/50">
            Higher tiers unlock extra perks
          </p>
        </div>
      </div>

      {/* Ways to Earn */}
      <div className={`${card} p-5 md:p-6`}>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[#7FFF00]/80">
          Ways to Earn
        </h2>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col justify-between rounded-xl border border-[#7FFF00]/15 bg-black/60 p-4">
            <div>
              <div className="flex items-center gap-2 text-[#7FFF00]">
                <TrendingUp className="h-4 w-4" strokeWidth={1.6} />
                <h3 className="text-sm font-medium">Crypto Deposit Bonuses</h3>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[#7FFF00]/65">
                Earn an instant <span className="font-medium text-[#7FFF00]">5% bonus</span> on
                Cryptomus deposits above $50, and a{" "}
                <span className="font-medium text-[#7FFF00]">7% bonus</span> on deposits above $500.
              </p>
            </div>
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate("add-funds")}
                className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-lg border border-[#7FFF00]/30 bg-[#7FFF00]/10 px-3 py-1.5 text-xs font-medium text-[#7FFF00] transition-colors hover:bg-[#7FFF00]/20 cursor-pointer"
              >
                Go to Add funds
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-col justify-between rounded-xl border border-[#7FFF00]/15 bg-black/60 p-4">
            <div>
              <div className="flex items-center gap-2 text-[#7FFF00]">
                <Sparkles className="h-4 w-4" strokeWidth={1.6} />
                <h3 className="text-sm font-medium">Tasks &amp; Rewards</h3>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[#7FFF00]/65">
                Complete promotional tasks, social shoutouts, and milestone challenges to earn
                free balance directly to your wallet.
              </p>
            </div>
            <span className="mt-4 inline-flex w-fit items-center rounded-lg border border-[#7FFF00]/15 bg-[#7FFF00]/5 px-3 py-1.5 text-xs text-[#7FFF00]/60">
              Coming soon
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
