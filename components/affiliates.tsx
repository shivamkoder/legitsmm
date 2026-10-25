"use client";

import React, { useEffect, useState } from "react";
import {
  UserPlus,
  Link2,
  Share2,
  Users,
  Wallet,
  MousePointerClick,
  Receipt,
  Clock,
  TrendingUp,
  Copy,
  Check,
  Info,
  ArrowUpRight,
  UserCheck,
  Banknote,
  Trophy,
} from "lucide-react";

const card = "rounded-2xl border border-[#7FFF00]/15 bg-[#050a02]";

export type TopEarner = { name: string; amount: number }; // name already masked, e.g. "joh***"

type Props = {
  code?: string; // the user's referral code
  visits?: number;
  registrations?: number;
  availableEarnings?: number;
  totalEarnings?: number;
  commissionRate?: number; // %
  minPayout?: number;
  topEarners?: TopEarner[]; // sorted: [1st, 2nd, 3rd]
  paidToDate?: number;
  activeAffiliates?: number;
  referredOrders?: number;
  onNavigate?: (id: string) => void;
};

export function Affiliates({
  code = "your-code", // TODO: load from Supabase (profiles.referral_code)
  visits = 0,
  registrations = 0,
  availableEarnings = 0,
  totalEarnings = 0,
  commissionRate = 3,
  minPayout = 5,
  topEarners = [],
  paidToDate = 0,
  activeAffiliates = 0,
  referredOrders = 0,
}: Props) {
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);

  // window only exists in the browser, so read it after mount
  useEffect(() => setOrigin(window.location.origin), []);

  const link = `${origin}/auth/sign-up?ref=${code}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  };

  const stats = [
    { label: "Visits", value: visits.toLocaleString(), icon: MousePointerClick },
    { label: "Registrations", value: registrations.toLocaleString(), icon: Wallet },
    { label: "Available earnings", value: `$${availableEarnings.toFixed(2)}`, icon: Clock },
    { label: "Total earnings", value: `$${totalEarnings.toFixed(2)}`, icon: TrendingUp },
  ];

  const banner = [
    { value: `$${paidToDate.toLocaleString()}`, label: "Paid to date" },
    { value: activeAffiliates.toLocaleString(), label: "Active affiliates" },
    { value: referredOrders.toLocaleString(), label: "Orders referred" },
  ];

  const steps = [
    {
      n: "01",
      icon: UserCheck,
      title: "Create your account",
      text: "Sign up, then open the Affiliates page to find your unique referral link.",
    },
    {
      n: "02",
      icon: Share2,
      title: "Share your link",
      text: "Send your link to friends, clients or your audience. Anyone who registers through it is tied to your account.",
    },
    {
      n: "03",
      icon: Banknote,
      title: "Earn commission",
      text: `Earn ${commissionRate}% of what your referrals spend. Once you reach $${minPayout}, you can redeem it as balance.`,
    },
  ];

  // podium: left = 3rd, middle = 2nd, right = 1st
  const podium = [
    { place: "3rd", idx: 2, h: "h-20" },
    { place: "2nd", idx: 1, h: "h-28" },
    { place: "1st", idx: 0, h: "h-40" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-[#7FFF00]/20 bg-gradient-to-br from-[#0d2a05] via-[#071a03] to-black p-6">
        <span className="absolute left-0 top-1/2 h-14 w-[3px] -translate-y-1/2 rounded-r bg-[#7FFF00]" />
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#7FFF00]/25 bg-[#7FFF00]/10">
                <UserPlus className="h-5 w-5 text-[#7FFF00]" strokeWidth={1.5} />
              </span>
              <h1 className="text-2xl font-bold text-white">Affiliates</h1>
            </div>
            <p className="mt-3 text-[13px] text-white/70">
              Recommend us to your friends and earn balance.
            </p>
          </div>

          <div className="w-full rounded-2xl border border-[#7FFF00]/20 bg-black/30 p-4 backdrop-blur sm:w-80">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-[13px] font-semibold text-white">
                <Link2 className="h-3.5 w-3.5 text-[#7FFF00]" />
                Your Referral
              </span>
              <span className="rounded-full bg-[#7FFF00]/15 px-2 py-0.5 text-[10px] font-semibold text-[#7FFF00]">
                EARN BALANCE
              </span>
            </div>
            <div className="mt-3 flex items-center gap-3 rounded-xl bg-black/40 px-3 py-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#7FFF00]/15">
                <Share2 className="h-4 w-4 text-[#7FFF00]" strokeWidth={1.75} />
              </span>
              <div className="min-w-0">
                <p className="text-[10px] uppercase text-white/40">Referral link</p>
                <p className="truncate text-[13px] font-medium text-white">{code}</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-[12px]">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-sky-400" />
                <div>
                  <p className="font-semibold text-white">Referrals</p>
                  <p className="text-[10px] text-white/40">Invite friends</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-sky-400" />
                <div>
                  <p className="font-semibold text-white">Balance</p>
                  <p className="text-[10px] text-white/40">Earn rewards</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className={`${card} p-5`}>
            <div className="flex items-start justify-between">
              <p className="text-[15px] text-white">{s.label}</p>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black">
                <s.icon className="h-4 w-4 text-[#7FFF00]" strokeWidth={1.75} />
              </span>
            </div>
            <p className="mt-3 text-2xl font-bold text-white">{s.value}</p>
            <p className="mt-3 border-t border-[#7FFF00]/10 pt-3 text-[13px] text-white/70">
              <span className="font-semibold text-[#7FFF00]">0%</span> from previous period
            </p>
          </div>
        ))}
      </div>

      {/* Referral + Top earners */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className={`${card} flex flex-col justify-center gap-5 p-6`}>
          <h2 className="text-2xl font-semibold text-white">Referral</h2>

          <div className="flex items-center justify-between gap-3 rounded-lg bg-[#7FFF00] px-4 py-2.5 text-black">
            <p className="min-w-0 truncate text-[13px]">
              <span className="font-bold">Referral link: </span>
              {link}
            </p>
            <button
              type="button"
              onClick={copy}
              aria-label="Copy referral link"
              className="shrink-0 rounded p-1 outline-none hover:bg-black/10 focus-visible:ring-2 focus-visible:ring-black/40"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>

          <p className="text-center text-[15px] text-white">
            Commission rate: <span className="font-semibold">{commissionRate}%</span>
            <span className="mx-2 text-white/40">|</span>
            Minimum payout: <span className="font-semibold">${minPayout.toFixed(2)}</span>
          </p>

          <p className="flex items-center justify-center gap-1.5 text-[13px] text-[#7FFF00]/80">
            <Info className="h-3.5 w-3.5" />
            Invite friends to earn commission
          </p>
        </div>

        <div className={`${card} p-6`}>
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col items-center gap-2 text-center">
              <span className="flex h-20 w-20 items-center justify-center rounded-full border border-[#7FFF00]/25 bg-[#7FFF00]/10">
                <Trophy className="h-9 w-9 text-[#7FFF00]" strokeWidth={1.5} />
              </span>
              <p className="text-[12px] text-white/50">Previous Month</p>
              <h3 className="text-xl font-bold text-white">Top Earners</h3>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="flex w-40 items-center justify-between rounded-lg bg-[#7FFF00] px-3 py-1.5 text-[13px] font-semibold text-black hover:bg-[#7FFF00]/85"
              >
                Join Us
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>

            <div className="flex items-end gap-3">
              {podium.map((p) => {
                const e = topEarners[p.idx];
                return (
                  <div key={p.place} className="flex flex-col items-center gap-2">
                    <div className="rounded-xl bg-white px-3 py-1.5 text-center">
                      <p className="text-[11px] text-gray-500">{e ? e.name : "—"}</p>
                      <p className="text-[13px] font-bold text-[#2a9d00]">
                        {e ? `$${e.amount.toLocaleString()}` : "$0.00"}
                      </p>
                    </div>
                    <div
                      className={`flex w-10 items-end justify-center rounded-full bg-[#7FFF00] pb-2 text-[12px] font-bold text-black ${p.h}`}
                    >
                      {p.place}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Stats banner */}
      <div className="rounded-2xl border border-[#7FFF00]/20 bg-gradient-to-r from-[#0d2a05] via-[#143d08] to-[#0d2a05] px-6 py-8">
        <div className="grid grid-cols-1 gap-6 text-center sm:grid-cols-3">
          {banner.map((b) => (
            <div key={b.label}>
              <p className="text-3xl font-bold text-white">{b.value}</p>
              <p className="mt-1 text-[13px] text-white/70">{b.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className={`${card} p-6`}>
        <h2 className="mb-6 text-center text-3xl font-semibold text-white">How Does It Work?</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="overflow-hidden rounded-xl border border-[#7FFF00]/15 bg-black/40">
              {/* Replace this block with an <img> if you have artwork */}
              <div className="flex h-36 items-center justify-center bg-gradient-to-br from-[#0d2a05] via-[#071a03] to-black">
                <s.icon className="h-14 w-14 text-[#7FFF00]" strokeWidth={1.25} />
              </div>
              <div className="p-4">
                <p className="text-[15px] font-bold text-[#7FFF00]">STEP {s.n}</p>
                <p className="mt-1 text-[14px] font-semibold text-white">{s.title}</p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-white/70">{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
