"use client";

import React, { useState } from "react";
import {
  LayoutGrid,
  Clock,
  Hourglass,
  CheckCircle2,
  BatteryMedium,
  Loader,
  Ban,
  Search,
} from "lucide-react";

type Status =
  | "pending"
  | "in-progress"
  | "completed"
  | "partial"
  | "processing"
  | "canceled";

export type Order = {
  id: string;
  service: string;
  link: string;
  charge: number;
  startCount: number;
  quantity: number;
  status: Status;
};

const filters: { id: "all" | Status; label: string; icon: React.ElementType }[] = [
  { id: "all", label: "All", icon: LayoutGrid },
  { id: "pending", label: "Pending", icon: Clock },
  { id: "in-progress", label: "In progress", icon: Hourglass },
  { id: "completed", label: "Completed", icon: CheckCircle2 },
  { id: "partial", label: "Partial", icon: BatteryMedium },
  { id: "processing", label: "Processing", icon: Loader },
  { id: "canceled", label: "Canceled", icon: Ban },
];

const statusStyle: Record<Status, string> = {
  pending: "bg-yellow-500/15 text-yellow-400",
  "in-progress": "bg-blue-500/15 text-blue-400",
  completed: "bg-[#7FFF00]/15 text-[#7FFF00]",
  partial: "bg-orange-500/15 text-orange-400",
  processing: "bg-purple-500/15 text-purple-400",
  canceled: "bg-red-500/15 text-red-400",
};

const statusLabel: Record<Status, string> = {
  pending: "Pending",
  "in-progress": "In progress",
  completed: "Completed",
  partial: "Partial",
  processing: "Processing",
  canceled: "Canceled",
};

const pillClass = (active: boolean) =>
  `flex items-center gap-2 rounded-xl border px-4 py-2.5 text-[13px] transition-colors outline-none focus-visible:ring-1 focus-visible:ring-[#7FFF00]/60 ${
    active
      ? "border-[#7FFF00]/50 bg-[#7FFF00]/10 text-[#7FFF00]"
      : "border-[#7FFF00]/15 bg-[#050a02] text-white/80 hover:border-[#7FFF00]/30 hover:text-white"
  }`;

// Grid shared by header and rows so columns line up.
const cols =
  "grid grid-cols-[70px_minmax(160px,2fr)_minmax(140px,2fr)_90px_100px_90px_110px] items-center gap-4 px-5";

export function Orders({ orders = [] }: { orders?: Order[] }) {
  // TODO: load orders from Supabase and pass them in
  const [filter, setFilter] = useState<"all" | Status>("all");
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const visible = orders.filter(
    (o) =>
      (filter === "all" || o.status === filter) &&
      (!q ||
        o.id.toLowerCase().includes(q) ||
        o.service.toLowerCase().includes(q) ||
        o.link.toLowerCase().includes(q)),
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Filters + search */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2.5">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={pillClass(filter === f.id)}
            >
              <f.icon className="h-4 w-4" strokeWidth={1.75} />
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex w-full items-center rounded-xl border border-[#7FFF00]/15 bg-[#050a02] px-3 transition-colors focus-within:border-[#7FFF00]/40 sm:w-64">
          <Search className="h-4 w-4 shrink-0 text-[#7FFF00]" strokeWidth={1.75} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="w-full bg-transparent px-3 py-3 text-[13px] text-white/90 outline-none placeholder:text-white/40"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-[#7FFF00]/15 bg-[#050a02]">
        <div className="overflow-x-auto">
          <div className="min-w-[860px]">
            <div className={`${cols} h-11 bg-black text-[13px] font-semibold text-white`}>
              <span>ID</span>
              <span>Service</span>
              <span>Link</span>
              <span>Charge</span>
              <span>Start count</span>
              <span>Quantity</span>
              <span>Status</span>
            </div>

            {visible.length === 0 ? (
              <div className="flex h-[420px] flex-col items-center justify-center gap-3">
                <span className="mb-2 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-black">
                  <Search className="h-7 w-7 text-white" strokeWidth={1.75} />
                </span>
                <h3 className="text-3xl font-semibold text-white">No result</h3>
                <p className="text-[13px] text-white/60">
                  If you need help, don&apos;t hesitate to bother us.
                </p>
              </div>
            ) : (
              visible.map((o) => (
                <div
                  key={o.id}
                  className={`${cols} border-t border-[#7FFF00]/10 py-3.5 text-[13px] text-white/80`}
                >
                  <span className="text-white">{o.id}</span>
                  <span className="truncate" title={o.service}>
                    {o.service}
                  </span>
                  <a
                    href={o.link}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate text-[#7FFF00]/80 hover:underline"
                    title={o.link}
                  >
                    {o.link}
                  </a>
                  <span>${o.charge.toFixed(2)}</span>
                  <span>{o.startCount.toLocaleString()}</span>
                  <span>{o.quantity.toLocaleString()}</span>
                  <span
                    className={`w-fit rounded-full px-2.5 py-1 text-[11px] font-medium ${statusStyle[o.status]}`}
                  >
                    {statusLabel[o.status]}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
