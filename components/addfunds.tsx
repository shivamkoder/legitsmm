"use client";

import React, { useRef, useState } from "react";
import {
  Bitcoin,
  CreditCard,
  FileSearch,
  Globe,
  History,
  Landmark,
  MessageSquare,
  Smartphone,
  Wallet,
} from "lucide-react";

type Method = {
  id: string;
  label: string;
  logo?: string; // optional image in /public/payments, e.g. "/payments/paypal.png"
  icon: React.ElementType; // fallback if no logo or the image fails to load
  instruction: string;
  min: number;
  enabled: boolean; // false = shown but not integrated yet
};

const soon = "This payment method is coming soon.";

// Same order as the reference screenshot.
// Only set enabled: true once the method is actually integrated on the server.
const methods: Method[] = [
  {
    id: "cryptomus",
    label: "Cryptomus",
    logo: "/payments/cryptomus.png",
    icon: Bitcoin,
    instruction:
      "Pay with crypto via Cryptomus. After you click Pay, you'll get a payment page with a wallet address. Funds are added once the network confirms.",
    min: 5,
    enabled: true,
  },
  { id: "heleket", label: "Heleket", logo: "/payments/heleket.png", icon: Bitcoin, instruction: soon, min: 5, enabled: false },
  { id: "tikokart", label: "Credit Card - Debit Card Payment | TikoKart", logo: "/payments/tikokart.png", icon: CreditCard, instruction: soon, min: 5, enabled: false },
  { id: "wise", label: "Wise", logo: "/payments/wise.png", icon: Landmark, instruction: soon, min: 5, enabled: false },
  { id: "paypal", label: "PayPal", logo: "/payments/paypal.png", icon: Wallet, instruction: soon, min: 5, enabled: false },
  { id: "pix", label: "PIX", logo: "/payments/pix.png", icon: Smartphone, instruction: soon, min: 5, enabled: false },
  { id: "revolut", label: "Revolut", logo: "/payments/revolut.png", icon: Landmark, instruction: soon, min: 5, enabled: false },
  { id: "africa-bank", label: "Africa Bank Transfer", logo: "/payments/africa-bank.png", icon: Landmark, instruction: soon, min: 5, enabled: false },
  { id: "alipay", label: "Alipay (Cina-pay)", logo: "/payments/alipay.png", icon: Smartphone, instruction: soon, min: 5, enabled: false },
  { id: "skrill", label: "Skrill", logo: "/payments/skrill.png", icon: Wallet, instruction: soon, min: 5, enabled: false },
  { id: "cashmaal", label: "Cashmaal | Jazzcash", logo: "/payments/cashmaal.png", icon: Smartphone, instruction: soon, min: 5, enabled: false },
  { id: "manual-crypto", label: "Manuel Crypto", logo: "/payments/manual-crypto.png", icon: Bitcoin, instruction: soon, min: 5, enabled: false },
  { id: "coinpayments", label: "Coinpayments", logo: "/payments/coinpayments.png", icon: Bitcoin, instruction: soon, min: 5, enabled: false },
  { id: "payoneer", label: "Payoneer", logo: "/payments/payoneer.png", icon: Globe, instruction: soon, min: 5, enabled: false },
  { id: "bkash", label: "bKash", logo: "/payments/bkash.png", icon: Smartphone, instruction: soon, min: 5, enabled: false },
  { id: "nagad", label: "Nagad", logo: "/payments/nagad.png", icon: Smartphone, instruction: soon, min: 5, enabled: false },
  { id: "shopier", label: "Turkish Card Payment - Shopier", logo: "/payments/shopier.png", icon: CreditCard, instruction: soon, min: 5, enabled: false },
];

const presets = [50, 100, 250];

const card = "rounded-2xl border border-[#7FFF00]/15 bg-[#050a02]";
const field =
  "flex w-full items-center rounded-xl border border-[#7FFF00]/15 bg-black/40 text-[13px] text-white/90 transition-colors focus-within:border-[#7FFF00]/40";

function MethodLogo({ method }: { method: Method }) {
  const [failed, setFailed] = useState(false);
  const Icon = method.icon;

  if (method.logo && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={method.logo}
        alt=""
        className="h-9 w-9 object-contain"
        onError={() => setFailed(true)}
      />
    );
  }
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#7FFF00]/10">
      <Icon className="h-5 w-5 text-[#7FFF00]" strokeWidth={1.5} />
    </span>
  );
}

function MethodGrid({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Payment method"
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
    >
      {methods.map((m) => {
        const selected = m.id === value;
        return (
          <button
            key={m.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(m.id)}
            className={`flex min-h-[104px] flex-col justify-between rounded-xl border p-4 text-left transition-colors outline-none focus-visible:ring-1 focus-visible:ring-[#7FFF00]/60 ${
              selected
                ? "border-[#7FFF00]/60 bg-[#7FFF00]/5"
                : "border-[#7FFF00]/15 bg-black/40 hover:border-[#7FFF00]/30"
            }`}
          >
            <span className="flex w-full items-start justify-between">
              <MethodLogo method={m} />
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                  selected ? "border-[#7FFF00]" : "border-white/25"
                }`}
              >
                {selected && <span className="h-2.5 w-2.5 rounded-full bg-[#7FFF00]" />}
              </span>
            </span>
            <span className="mt-3 flex items-center gap-2">
              <span className="text-[13px] font-semibold leading-snug text-white">
                {m.label}
              </span>
              {!m.enabled && (
                <span className="shrink-0 rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] text-white/60">
                  Soon
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function AddFunds() {
  const [methodId, setMethodId] = useState(methods[0].id);
  const [amount, setAmount] = useState("");
  const [custom, setCustom] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const amountRef = useRef<HTMLInputElement>(null);

  const method = methods.find((m) => m.id === methodId) ?? methods[0];

  const pickPreset = (v: number) => {
    setCustom(false);
    setAmount(String(v));
    setError(null);
  };

  const pickCustom = () => {
    setCustom(true);
    setAmount("");
    setError(null);
    amountRef.current?.focus();
  };

  const handlePay = async () => {
    if (!method.enabled) {
      setError(`${method.label} is not available yet.`);
      return;
    }
    const value = Number(amount);
    if (!value || value < method.min) {
      setError(`Minimum deposit is $${method.min}`);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      // TODO: POST { method: method.id, amount: value } to /api/payments/<method>
      // (server route that creates the invoice) then redirect to the returned
      // payment URL. Never credit the balance from the browser.
      console.log({ method: method.id, amount: value });
    } finally {
      setLoading(false);
    }
  };

  const presetClass = (active: boolean) =>
    `rounded-xl border py-3 text-[13px] font-semibold transition-colors outline-none focus-visible:ring-1 focus-visible:ring-[#7FFF00]/60 ${
      active
        ? "border-[#7FFF00]/50 bg-[#7FFF00]/10 text-[#7FFF00]"
        : "border-[#7FFF00]/15 bg-black/60 text-white/80 hover:border-[#7FFF00]/30 hover:text-white"
    }`;

  return (
    <div className="flex flex-col gap-6">
      {/* Payment methods */}
      <div className={`${card} p-5 md:p-6`}>
        <MethodGrid
          value={methodId}
          onChange={(id) => {
            setMethodId(id);
            setError(null);
          }}
        />
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        {/* Payment details card */}
        <div className={`${card} p-5 md:p-6`}>
          <p className="mb-2 text-[13px] font-medium text-white">Instruction</p>
          <div className="min-h-[60px] rounded-xl border border-[#7FFF00]/10 bg-gradient-to-r from-[#7FFF00]/[0.03] via-[#7FFF00]/[0.07] to-[#7FFF00]/[0.03] px-4 py-3 text-xs leading-relaxed text-white/60">
            {method.instruction}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {presets.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => pickPreset(p)}
                aria-pressed={!custom && amount === String(p)}
                className={presetClass(!custom && amount === String(p))}
              >
                {p}
              </button>
            ))}
            <button
              type="button"
              onClick={pickCustom}
              aria-pressed={custom}
              className={presetClass(custom)}
            >
              Custom
            </button>
          </div>

          <p className="mb-2 mt-6 text-[13px] font-medium text-white">Amount</p>
          <div className={`${field} px-4`}>
            <span className="text-white/40">$</span>
            <input
              ref={amountRef}
              type="number"
              inputMode="decimal"
              min={method.min}
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setCustom(!presets.includes(Number(e.target.value)));
              }}
              className="w-full bg-transparent px-2 py-3.5 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
          <p className="mt-1.5 text-xs text-white/40">Minimum: ${method.min}</p>
          {error && <p className="mt-2 text-xs text-red-400">{error}</p>}

          <button
            type="button"
            onClick={handlePay}
            disabled={loading || !method.enabled}
            className="mt-5 rounded-xl bg-[#7FFF00] px-8 py-3 text-[13px] font-semibold text-black transition-colors hover:bg-[#7FFF00]/85 disabled:opacity-60 outline-none focus-visible:ring-2 focus-visible:ring-[#7FFF00]/60"
          >
            {loading ? "Processing..." : "Pay"}
          </button>
        </div>

        {/* Recent deposits card */}
        <div className={`${card} overflow-hidden`}>
          <div className="flex items-center gap-3 border-b border-[#7FFF00]/15 px-5 py-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#7FFF00]/15">
              <History className="h-4 w-4 text-[#7FFF00]" strokeWidth={1.5} />
            </span>
            <h2 className="text-base font-semibold text-white">Recent Deposits</h2>
          </div>

          {/* TODO: replace empty state with deposits from Supabase */}
          <div className="flex h-64 flex-col items-center justify-center gap-4">
            <FileSearch className="h-16 w-16 text-white" strokeWidth={1.25} />
            <p className="text-[13px] text-white/90">There is no active payment.</p>
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-[#7FFF00]/15 px-5 py-4">
            <div>
              <p className="text-[15px] font-semibold text-white">Do you need help?</p>
              <p className="text-xs text-white/50">We&apos;d be glad to assist you!</p>
            </div>
            <button
              type="button"
              onClick={() => {
                /* TODO: link to tickets page */
              }}
              className="flex shrink-0 items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-[13px] font-medium text-black hover:bg-white/90"
            >
              <MessageSquare className="h-4 w-4" strokeWidth={1.5} />
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
