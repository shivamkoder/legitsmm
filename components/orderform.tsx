"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  Link2,
  Minus,
  Plus,
} from "lucide-react";
import ArrowFillButton from "@/components/goodbutton";
import { useServices } from "@/lib/services";

type Option = { id: string; label: string };

export const PLATFORM_CATEGORIES: Record<string, string[]> = {
  instagram: [
    "Followers",
    "Views",
    "Comments",
    "Shares",
    "Likes",
    "Saves",
    "Impressions",
  ],
  youtube: [
    "Views",
    "Subscribers",
    "Likes",
    "Comments",
    "Watch Time",
    "Shares",
  ],
  tiktok: [
    "Followers",
    "Likes",
    "Views",
    "Shares",
    "Comments",
    "Saves",
  ],
  telegram: [
    "Members",
    "Channel Views",
    "Post Reactions",
    "Bot Starts",
    "Comments",
  ],
  facebook: [
    "Followers",
    "Page Likes",
    "Post Likes",
    "Views",
    "Shares",
    "Comments",
  ],
  x: [
    "Followers",
    "Likes",
    "Retweets",
    "Views",
    "Comments",
    "Impressions",
  ],
  spotify: [
    "Plays",
    "Monthly Listeners",
    "Followers",
    "Saves",
    "Playlist Followers",
  ],
  twitch: [
    "Followers",
    "Live Viewers",
    "Channel Views",
    "Chatters",
  ],
  pinterest: [
    "Followers",
    "Repins",
    "Board Followers",
    "Reactions",
  ],
  snapchat: [
    "Followers",
    "Story Views",
    "Spotlight Views",
  ],
  discord: [
    "Server Members",
    "Online Members",
    "Reactions",
  ],
  reddit: [
    "Upvotes",
    "Post Karma",
    "Subreddit Subscribers",
    "Comments",
  ],
  whatsapp: [
    "Channel Members",
    "Community Members",
    "Reactions",
  ],
};

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
  platform,
  onServiceChange,
}: {
  platform: string;
  onServiceChange?: (s: ServiceItem | null) => void;
}) {
  const { services, loading: loadingServices, error: servicesError } = useServices();

  const [categoryId, setCategoryId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [link, setLink] = useState("");
  const [quantity, setQuantity] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Only the services of the platform picked above the form.
  const platformServices = useMemo(
    () => services.filter((s) => s.platform.toLowerCase() === platform.toLowerCase()),
    [services, platform],
  );

  // Start fresh whenever the user switches platform.
  useEffect(() => {
    setCategoryId("");
    setServiceId("");
    setQuantity("");
    setFormError(null);
    setSuccess(null);
  }, [platform]);

  const categories = useMemo<Option[]>(() => {
    const platformKey = platform.toLowerCase();
    const list = PLATFORM_CATEGORIES[platformKey] ?? [
      "Followers",
      "Likes",
      "Views",
      "Comments",
      "Shares",
    ];

    // Find any additional categories from DB services that aren't already represented
    const dbCategories = [...new Set(platformServices.map((s) => s.category).filter(Boolean))];
    const extraCategories = dbCategories.filter((dbCat) => {
      const dbLower = dbCat.toLowerCase();
      return !list.some((c) => {
        const cLower = c.toLowerCase();
        const root = cLower.endsWith("s") ? cLower.slice(0, -1) : cLower;
        return dbLower === cLower || dbLower.includes(root);
      });
    });

    return [...list, ...extraCategories].map((c) => ({
      id: c,
      label: c,
    }));
  }, [platform, platformServices]);

  // Fall back to the first category / service until the user picks one.
  const activeCategory = categories.some((c) => c.id === categoryId)
    ? categoryId
    : (categories[0]?.id ?? "");

  const serviceList = useMemo<ServiceItem[]>(() => {
    if (!activeCategory) return [];

    const catLower = activeCategory.toLowerCase();
    const root = catLower.endsWith("s") ? catLower.slice(0, -1) : catLower;

    const matched = platformServices.filter((s) => {
      const sCat = (s.category || "").toLowerCase();
      const sName = (s.name || "").toLowerCase();

      // Direct match
      if (sCat === catLower) return true;
      // Partial match on category (e.g. "Instagram Followers", "Instagram Save")
      if (sCat.includes(catLower) || sCat.includes(root)) return true;
      // Partial match on name if category didn't match
      if (sName.includes(catLower) || sName.includes(root)) return true;

      return false;
    });

    return matched.map((s) => ({
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
    }));
  }, [platformServices, activeCategory]);

  const service = serviceList.find((s) => s.id === serviceId) ?? serviceList[0] ?? null;
  const activeServiceId = service?.id ?? "";

  // Tell the parent which service is selected so the details panel can update.
  useEffect(() => {
    onServiceChange?.(service);
  }, [service, onServiceChange]);

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
      {servicesError && (
        <p className="text-xs text-red-400">Could not load services: {servicesError}</p>
      )}
      {loadingServices && <p className="text-xs text-white/50">Loading services...</p>}
      {!loadingServices && !servicesError && platformServices.length === 0 && (
        <p className="text-xs text-white/50">No services available for this platform yet.</p>
      )}

      {/* Category */}
      <div>
        <Label>Category</Label>
        <Dropdown
          value={activeCategory}
          options={categories}
          onChange={handleCategory}
        />
      </div>

      {/* Service */}
      <div>
        <Label>Service</Label>
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
