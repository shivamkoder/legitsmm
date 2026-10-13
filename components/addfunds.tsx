"use client";

import React, { useEffect, useRef, useState } from "react";
import { Box, ChevronDown, FileSearch, History, MessageSquare } from "lucide-react";

type Method = { id: string; label: string; instruction: string; min: number };

// Placeholder methods. Add more here later.
const methods: Method[] = [
  {
    id: "cryptomus",
    label: "Cryptomus",
    instruction:
      "Pay with crypto via Cryptomus. After you click Pay, you'll get a payment page with a wallet address. Funds are added once the network confirms.",
    min: 5,
  },
];

const presets = [50, 100, 250];

const card = "rounded-2xl border border-[#7FFF00]/15 bg-[#050a02]";
const field =
  "flex w-full items-center rounded-xl border border-[#7FFF00]/15 bg-black/40 text-[13px] text-white/90 transition-colors focus-within:border-[#7FFF00]/40";

function MethodSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = methods.find((m) => m.id === value) ?? methods[0];

  const Item = ({ m }: { m: Method }) => (
    <span className="flex items-center gap-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black border border-[#7FFF00]/30">
        <Box className="h-4 w-4 text-[#7FFF00]" strokeWidth={1.5} />
      </span>
      <span className="font-medium">{m.label}</span>
    </span>
  );

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`${field} justify-between px-3 py-3 text-left outline-none focus-visible:ring-1 focus-visible:ring-[#7FFF00]/60`}
      >
        <Item m={current} />
        <ChevronDown
          className={`h-4 w-4 text-[#7FFF00]/60 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-full rounded-xl border border-[#7FFF00]/20 bg-[#050a02] p-2 shadow-lg">
          {methods.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                onChange(m.id);
                setOpen(false);
              }}
              className={`flex w-full items-center rounded-md px-2 py-2 text-left text-[13px] hover:bg-[#7FFF00]/10 ${
                m.id === value ? "text-[#7FFF00]" : "text-white/80"
              }`}
            >
              <Item m={m} />
            </button>
          ))}
        </div>
      )}
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
    const value = Number(amount);
    if (!value || value < method.min) {
      setError(`Minimum deposit is $${method.min}`);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      // TODO: POST to /api/payments/cryptomus (server route that creates the
      // invoice) then redirect to the returned payment URL.
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
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
      {/* Payment card */}
      <div className={`${card} p-5 md:p-6`}>
        <MethodSelect value={methodId} onChange={setMethodId} />

        <p className="mb-2 mt-6 text-[13px] font-medium text-white">Instruction</p>
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
        {error && <p className="mt-2 text-xs text-red-400">{error}</p>}

        <button
          type="button"
          onClick={handlePay}
          disabled={loading}
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
  );
}
