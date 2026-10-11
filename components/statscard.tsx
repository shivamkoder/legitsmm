import React from "react";
import { Wallet, Receipt, BarChart3, Crown } from "lucide-react";

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
    <div className="w-full rounded-2xl border border-[#7FFF00]/15 bg-[#050a02] p-5 md:p-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.id} className="flex items-center gap-4 min-w-0">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#7FFF00]/15 border border-[#7FFF00]/30">
              <s.icon className="h-5 w-5 text-[#7FFF00]" strokeWidth={1.5} />
            </span>
            <div className="min-w-0">
              <p className="text-[13px] text-[#7FFF00]/60">{s.label}</p>
              <p className="truncate text-lg font-semibold text-[#7FFF00]">
                {s.value}
              </p>
              <button
                type="button"
                onClick={() => s.linkTarget && onNavigate?.(s.linkTarget)}
                className="text-xs text-[#7FFF00]/60 underline-offset-4 hover:text-[#7FFF00] hover:underline outline-none focus-visible:ring-1 focus-visible:ring-[#7FFF00]/60 rounded"
              >
                {s.linkText}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
