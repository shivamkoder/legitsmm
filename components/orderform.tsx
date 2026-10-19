"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Search,
  ChevronDown,
  Heart,
  Link2,
  Minus,
  Plus,
} from "lucide-react";

type Option = { id: string; label: string };

export type ServiceItem = Option & {
  rate: number; // price per 1000
  min: number;
  max: number;
  platform: string; // "instagram", "youtube", ...
  startTime: string; // "0-1Hr"
  speed: string; // "2-5K/D"
  refill: string | null; // null = no refill, otherwise e.g. "30 Days"
  linkHint: string; // "Username", "Post link", ...
};

// Placeholder data. Replace with real services from Supabase later.
const categories: Option[] = [
  { id: "ig-followers", label: "Instagram Followers (Own - Working)" },
  { id: "ig-likes", label: "Instagram Likes" },
  { id: "ig-views", label: "Instagram Views" },
];

const services: Record<string, ServiceItem[]> = {
  "ig-followers": [
    {
      id: "777",
      label:
        "Instagram Followers (Best, App Data, Start 0-1Hr, Speed: 2-5K/day, Low Drop, No Refill)",
      rate: 1.6934,
      min: 100,
      max: 100000,
      platform: "instagram",
      startTime: "0-1Hr",
      speed: "2-5K/D",
      refill: null,
      linkHint: "Username",
    },
  ],
  "ig-likes": [
    {
      id: "778",
      label: "Instagram Likes (Instant)",
      rate: 0.5,
      min: 50,
      max: 50000,
      platform: "instagram",
      startTime: "Instant",
      speed: "10K/D",
      refill: null,
      linkHint: "Post link",
    },
  ],
  "ig-views": [
    {
      id: "779",
      label: "Instagram Views (Instant)",
      rate: 0.1,
      min: 100,
      max: 1000000,
      platform: "instagram",
      startTime: "Instant",
      speed: "50K/D",
      refill: null,
      linkHint: "Reel link",
    },
  ],
};

const fieldBase =
  "flex w-full items-center rounded-xl border border-[#7FFF00]/15 bg-black/40 text-[13px] text-white/90 transition-colors focus-within:border-[#7FFF00]/40";

function Dropdown({
  value,
  options,
  onChange,
  renderLabel,
}: {
  value: string;
  options: Option[];
  onChange: (id: string) => void;
  renderLabel?: (o: Option) => React.ReactNode;
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

  const current = options.find((o) => o.id === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`${fieldBase} justify-between px-4 py-3.5 text-left outline-none focus-visible:ring-1 focus-visible:ring-[#7FFF00]/60`}
      >
        <span className="min-w-0 flex-1 truncate">
          {current ? (renderLabel ? renderLabel(current) : current.label) : "Select..."}
        </span>
        <ChevronDown
          className={`ml-3 h-4 w-4 shrink-0 text-[#7FFF00]/60 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-[#7FFF00]/20 bg-[#050a02] p-2 shadow-lg">
          {options.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => {
                onChange(o.id);
                setOpen(false);
              }}
              className={`flex w-full items-center rounded-md px-2 py-2 text-left text-[13px] hover:bg-[#7FFF00]/10 ${
                o.id === value ? "text-[#7FFF00]" : "text-white/80"
              }`}
            >
              {renderLabel ? renderLabel(o) : o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="mb-2 block text-[13px] font-medium text-white">{children}</label>
);

export function OrderForm({
  onServiceChange,
}: {
  onServiceChange?: (s: ServiceItem | null) => void;
}) {
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0].id);
  const [serviceId, setServiceId] = useState(services[categories[0].id][0].id);
  const [favorite, setFavorite] = useState(false);
  const [link, setLink] = useState("");
  const [quantity, setQuantity] = useState("");

  const serviceList = services[categoryId] ?? [];
  const service = serviceList.find((s) => s.id === serviceId) ?? serviceList[0];

  // Tell the parent which service is selected so the details panel can update.
  useEffect(() => {
    onServiceChange?.(service ?? null);
  }, [service, onServiceChange]);

  const filteredCategories = query.trim()
    ? categories.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()))
    : categories;

  const handleCategory = (id: string) => {
    setCategoryId(id);
    setServiceId(services[id]?.[0]?.id ?? "");
    setQuantity("");
  };

  const qty = Number(quantity) || 0;
  const charge = service ? (qty / 1000) * service.rate : 0;

  const step = 100;
  const adjust = (delta: number) => {
    const next = Math.max(service?.min ?? 0, qty + delta);
    setQuantity(String(Math.min(next, service?.max ?? next)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: validate and create the order in Supabase
    console.log({ serviceId, link, quantity: qty, charge });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Search */}
      <div className={`${fieldBase} gap-2.5 px-4 py-3.5`}>
        <Search className="h-4 w-4 shrink-0 text-white" strokeWidth={2} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
          className="w-full bg-transparent outline-none placeholder:text-white/40"
        />
      </div>

      {/* Category */}
      <div>
        <Label>Category</Label>
        <Dropdown
          value={categoryId}
          options={filteredCategories}
          onChange={handleCategory}
        />
      </div>

      {/* Service */}
      <div>
        <div className="mb-2 flex items-center gap-2">
          <span className="text-[13px] font-medium text-white">Service</span>
          <button
            type="button"
            onClick={() => setFavorite((f) => !f)}
            aria-pressed={favorite}
            className={`flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] transition-colors ${
              favorite
                ? "border-red-500 bg-red-500/15 text-red-400"
                : "border-red-500/60 text-red-400 hover:bg-red-500/10"
            }`}
          >
            <Heart className="h-3 w-3" fill={favorite ? "currentColor" : "none"} />
            {favorite ? "Favorited" : "Add to Favorite"}
          </button>
        </div>
        <Dropdown
          value={serviceId}
          options={serviceList}
          onChange={setServiceId}
          renderLabel={(o) => (
            <span className="flex items-center gap-2">
              <span className="shrink-0 rounded-full bg-[#7FFF00]/20 px-2 py-0.5 text-[11px] font-semibold text-[#7FFF00]">
                {o.id}
              </span>
              <span className="truncate">- {o.label}</span>
            </span>
          )}
        />
      </div>

      {/* Link */}
      <div>
        <Label>Link</Label>
        <div className={`${fieldBase} overflow-hidden`}>
          <span className="flex items-center self-stretch border-r border-[#7FFF00]/15 px-4">
            <Link2 className="h-4 w-4 text-[#7FFF00]" strokeWidth={1.75} />
          </span>
          <input
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder={service?.linkHint}
            className="w-full bg-transparent px-4 py-3.5 outline-none placeholder:text-white/30"
          />
        </div>
      </div>

      {/* Quantity */}
      <div>
        <Label>Quantity</Label>
        <div className={`${fieldBase} gap-2 p-1.5`}>
          <button
            type="button"
            onClick={() => adjust(-step)}
            aria-label="Decrease quantity"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#7FFF00] text-black hover:bg-[#7FFF00]/85"
          >
            <Minus className="h-4 w-4" strokeWidth={2.5} />
          </button>
          <input
            type="number"
            inputMode="numeric"
            min={service?.min}
            max={service?.max}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full bg-transparent text-center outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <button
            type="button"
            onClick={() => adjust(step)}
            aria-label="Increase quantity"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#7FFF00] text-black hover:bg-[#7FFF00]/85"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>
        {service && (
          <p className="mt-1.5 text-xs text-white/40">
            Min: {service.min.toLocaleString()} - Max: {service.max.toLocaleString()}
          </p>
        )}
      </div>

      {/* Charge */}
      <div>
        <Label>Charge</Label>
        <div className={`${fieldBase} px-4 py-3.5`}>
          <input
            type="text"
            readOnly
            value={qty > 0 ? `$${charge.toFixed(2)}` : ""}
            className="w-full bg-transparent outline-none"
          />
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full rounded-xl bg-[#7FFF00] py-3.5 text-[13px] font-semibold text-black transition-colors hover:bg-[#7FFF00]/85 outline-none focus-visible:ring-2 focus-visible:ring-[#7FFF00]/60"
      >
        Submit
      </button>
    </form>
  );
}
