"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  ChevronDown,
  Heart,
  Link2,
  Minus,
  Plus,
} from "lucide-react";
import ArrowFillButton from "@/components/goodbutton";
import { useServices } from "@/lib/services";

type Option = { id: string; label: string };

export type ServiceItem = Option & {
  rate: number; // price per 1000
  min: number;
  max: number;
  platform: string; // "instagram", "youtube", ...
  startTime: string;
  speed: string;
  refill: string | null; // null = no refill
  linkHint: string;
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
          {options.length === 0 ? (
            <p className="px-2 py-2 text-[13px] text-white/50">Nothing here yet</p>
          ) : (
            options.map((o) => (
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
            ))
          )}
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
  const { services, loading: loadingServices, error: servicesError } = useServices();

  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [favorite, setFavorite] = useState(false);
  const [link, setLink] = useState("");
  const [quantity, setQuantity] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const categories = useMemo<Option[]>(
    () => [...new Set(services.map((s) => s.category))].map((c) => ({ id: c, label: c })),
    [services],
  );

  // Fall back to the first category / service until the user picks one.
  const activeCategory = categories.some((c) => c.id === categoryId)
    ? categoryId
    : (categories[0]?.id ?? "");

  const serviceList = useMemo<ServiceItem[]>(
    () =>
      services
        .filter((s) => s.category === activeCategory)
        .map((s) => ({
          id: String(s.id),
          label: s.name,
          rate: s.rate,
          min: s.min_qty,
          max: s.max_qty,
          platform: s.platform,
          refill: s.refill ? "Yes" : null,
          startTime: "-",
          speed: "-",
          linkHint: "Link",
        })),
    [services, activeCategory],
  );

  const service = serviceList.find((s) => s.id === serviceId) ?? serviceList[0] ?? null;
  const activeServiceId = service?.id ?? "";

  // Tell the parent which service is selected so the details panel can update.
  useEffect(() => {
    onServiceChange?.(service);
  }, [service, onServiceChange]);

  const filteredCategories = query.trim()
    ? categories.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()))
    : categories;

  const handleCategory = (id: string) => {
    setCategoryId(id);
    setServiceId("");
    setQuantity("");
    setFormError(null);
  };

  const qty = Number(quantity) || 0;
  const charge = service ? (qty / 1000) * service.rate : 0;

  const step = 100;
  const adjust = (delta: number) => {
    const next = Math.max(service?.min ?? 0, qty + delta);
    setQuantity(String(Math.min(next, service?.max ?? next)));
  };

  const submitOrder = async () => {
    if (submitting) return;
    setFormError(null);
    setSuccess(null);

    if (!service) return setFormError("Select a service.");
    if (!link.trim()) return setFormError("Enter a link.");
    if (!Number.isInteger(qty) || qty < service.min || qty > service.max) {
      return setFormError(
        `Quantity must be between ${service.min.toLocaleString()} and ${service.max.toLocaleString()}.`,
      );
    }

    setSubmitting(true);
    try {
      // The server recomputes price and checks balance. Nothing here is trusted.
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId: service.id, link: link.trim(), quantity: qty }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "Could not place order.");

      setSuccess(
        json.warning
          ? `Order #${json.orderId} placed. ${json.warning}`
          : `Order #${json.orderId} placed.`,
      );
      setLink("");
      setQuantity("");
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Could not place order.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submitOrder();
      }}
      className="flex flex-col gap-5"
    >
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

      {servicesError && (
        <p className="text-xs text-red-400">Could not load services: {servicesError}</p>
      )}
      {loadingServices && <p className="text-xs text-white/50">Loading services...</p>}

      {/* Category */}
      <div>
        <Label>Category</Label>
        <Dropdown
          value={activeCategory}
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
          value={activeServiceId}
          options={serviceList}
          onChange={(id) => {
            setServiceId(id);
            setFormError(null);
          }}
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

      {formError && <p className="text-xs text-red-400">{formError}</p>}
      {success && <p className="text-xs text-[#7FFF00]">{success}</p>}

      {/* Submit */}
      <div className={submitting ? "pointer-events-none opacity-60" : ""}>
        <ArrowFillButton
          btnText={submitting ? "Submitting..." : "Submit"}
          href="#"
          role="button"
          onClick={(e) => {
            e.preventDefault();
            submitOrder();
          }}
          bgColor="#7FFF00"
          textColor="#000000"
          fillBgColor="#000000"
          fillTextColor="#7FFF00"
          hoverFillBgColor="#000000"
          hoverFillTextColor="#7FFF00"
          className="!w-full !h-14 !text-[14px] !font-semibold ![--pad-x:16px] ![--pad-r:12px] ![--icon-circle:40px] ![--icon-right:8px]"
        />
      </div>
    </form>
  );
}
