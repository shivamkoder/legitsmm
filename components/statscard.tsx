import React from "react";
import { Wallet, Receipt, BarChart3, Crown, ArrowUpRight } from "lucide-react";

type Stat = {
  id: string;
  icon: React.ElementType;
  label: string;
  value: string;
  linkText: string;
  linkTarget?: string; // sidebar id to navigate to
};

export function StatsCard({
  balance = 0,
  spent = 0,
  points = 0,
  status = "New",
  onNavigate,
}: {
  balance?: number;
  spent?: number;
  points?: number;
  status?: string;
  onNavigate?: (id: string) => void;
}) {
  const stats: Stat[] = [
    {
      id: "balance",
      icon: Wallet,
      label: "Balance",
      value: `$${balance.toFixed(2)}`,
      linkText: "Fill balance",
      linkTarget: "add-funds",
    },
    {
      id: "spent",
      icon: Receipt,
      label: "Spent",
      value: `$${spent.toFixed(2)}`,
      linkText: "Recent orders",
      linkTarget: "orders",
    },
    {
      id: "points",
      icon: BarChart3,
      label: "Account Points",
      value: `${points}`,
      linkText: "Redeem funds",
    },
    {
      id: "status",
      icon: Crown,
      label: "Account Status",
      value: status,
      linkText: "Learn more",
    },
  ];

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border-2 border-[#7FFF00]/40 bg-gradient-to-br from-[#0b1a03] via-[#050a02] to-black p-3 shadow-[0_0_40px_-12px_rgba(127,255,0,0.45)] md:p-4">
      {/* soft glow behind the tiles */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#7FFF00]/10 blur-3xl" />

      <div className="relative grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.id}
            className="group flex items-center gap-4 rounded-2xl border-2 border-[#7FFF00]/20 bg-black/50 p-4 transition-colors hover:border-[#7FFF00]/60"
          >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border-2 border-[#7FFF00]/40 bg-[#7FFF00]/15">
              <s.icon className="h-6 w-6 text-[#7FFF00]" strokeWidth={1.75} />
            </span>

            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium text-white/60">{s.label}</p>
              <p className="truncate text-2xl font-bold leading-tight text-[#7FFF00]">
                {s.value}
              </p>
              <button
                type="button"
                onClick={() => s.linkTarget && onNavigate?.(s.linkTarget)}
                className="mt-0.5 flex items-center gap-1 rounded text-xs text-white/50 outline-none transition-colors hover:text-[#7FFF00] focus-visible:ring-1 focus-visible:ring-[#7FFF00]/60"
              >
                {s.linkText}
                <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
