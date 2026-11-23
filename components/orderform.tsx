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
  audience: string; // "Organic", "Mix", "Bot"
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

  const [categoryId, setCategoryId] = useState("all");
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

  // Reset when platform changes
  useEffect(() => {
    setCategoryId("all");
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

    return [
      { id: "all", label: "All Categories" },
      ...list.map((c) => ({ id: c, label: c })),
      ...extraCategories.map((c) => ({ id: c, label: c })),
    ];
  }, [platform, platformServices]);

  const activeCategory = categoryId || "all";

  // Compute counts per category
  const categoryCounts = useMemo<Record<string, number>>(() => {
    const counts: Record<string, number> = {
      all: platformServices.length,
    };
    for (const c of categories) {
      if (c.id === "all") continue;
      const catLower = c.id.toLowerCase();
      const root = catLower.endsWith("s") ? catLower.slice(0, -1) : catLower;
      const cnt = platformServices.filter((s) => {
        const sCat = (s.category || "").toLowerCase();
        const sName = (s.name || "").toLowerCase();
        return (
          sCat === catLower ||
          sCat.includes(catLower) ||
          sCat.includes(root) ||
          sName.includes(catLower) ||
          sName.includes(root)
        );
      }).length;
      counts[c.id] = cnt;
    }
    return counts;
  }, [categories, platformServices]);

  const serviceList = useMemo<ServiceItem[]>(() => {
    if (platformServices.length === 0) return [];

    let matched = platformServices;

    if (activeCategory !== "all") {
      const catLower = activeCategory.toLowerCase();
      const root = catLower.endsWith("s") ? catLower.slice(0, -1) : catLower;

      matched = platformServices.filter((s) => {
        const sCat = (s.category || "").toLowerCase();
        const sName = (s.name || "").toLowerCase();

        return (
          sCat === catLower ||
          sCat.includes(catLower) ||
          sCat.includes(root) ||
          sName.includes(catLower) ||
          sName.includes(root)
        );
      });
    }

    // Curated preferred order for services: 9052, 8702, 9035, 6508, 7403, 9033
    const preferredOrder = ["9052", "8702", "9035", "6508", "7403", "9033"];
    const sorted = [...matched].sort((a, b) => {
      const aIdx = preferredOrder.indexOf(String(a.id));
      const bIdx = preferredOrder.indexOf(String(b.id));
      if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
      if (aIdx !== -1) return -1;
      if (bIdx !== -1) return 1;
      return a.id - b.id;
    });

    return sorted.map((s) => {
      let aud = s.audience;
      if (!aud) {
        const lower = s.name.toLowerCase();
        if (lower.includes("bot")) aud = "Bot";
        else if (lower.includes("mix")) aud = "Mix";
        else aud = "Organic";
      }
      return {
        id: String(s.id),
        label: s.name,
        rate: Number(s.rate),
        min: Number(s.min_qty),
        max: Number(s.max_qty),
        platform: s.platform,
        refill: s.refill ? "Yes" : null,
        audience: aud,
        startTime: s.start_time ?? "Instant",
        speed: s.speed ?? "10K - 100K/Day",
        linkHint: s.link_hint ?? "Instagram Profile / Post link",
      };
    });
  }, [platformServices, activeCategory]);

  // Auto-select the first service in the list if none selected or current is invalid
  useEffect(() => {
    if (serviceList.length > 0 && (!serviceId || !serviceList.some((s) => s.id === serviceId))) {
      setServiceId(serviceList[0].id);
    }
  }, [serviceList, serviceId]);

  const service = serviceList.find((s) => s.id === serviceId) ?? serviceList[0] ?? null;
  const activeServiceId = service?.id ?? "";

  // Auto-fill minimum quantity when a service is selected
  useEffect(() => {
    if (service && (!quantity || Number(quantity) < service.min)) {
      setQuantity(String(service.min));
    }
  }, [service?.id]);

  // Tell the parent which service is selected so the details panel can update.
  useEffect(() => {
    onServiceChange?.(service);
  }, [service, onServiceChange]);

  const handleCategory = (id: string) => {
    setCategoryId(id);
    setServiceId("");
    setFormError(null);
  };

  const qty = Number(quantity) || 0;
  const charge = service ? (qty / 1000) * service.rate : 0;
  const formattedCharge = qty > 0 ? `$${charge.toFixed(4)}` : "";

  const step = 100;
  const adjust = (delta: number) => {
    if (!service) return;
    const currentQty = Number(quantity) || service.min;
    const next = Math.max(service.min, currentQty + delta);
    setQuantity(String(Math.min(next, service.max)));
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
          renderLabel={(o) => (
            <span className="flex items-center justify-between w-full">
              <span>{o.label}</span>
              {categoryCounts[o.id] !== undefined && (
                <span
                  className={`text-[11px] rounded-full px-2 py-0.5 font-medium ${
                    categoryCounts[o.id] > 0
                      ? "bg-[#7FFF00]/15 text-[#7FFF00]"
                      : "bg-white/10 text-white/40"
                  }`}
                >
                  {categoryCounts[o.id]}
                </span>
              )}
            </span>
          )}
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
          renderLabel={(o) => {
            const item = o as ServiceItem;
            if (item.rate === undefined) return <span>{item.label}</span>;
            return (
              <span className="flex items-center justify-between gap-3 w-full">
                <span className="flex items-center gap-2 min-w-0 truncate">
                  <span className="shrink-0 rounded-full bg-[#7FFF00]/20 px-2 py-0.5 text-[11px] font-semibold text-[#7FFF00]">
                    #{item.id}
                  </span>
                  <span className="truncate">{item.label}</span>
                </span>
                <span className="shrink-0 text-xs font-semibold text-[#7FFF00]">
                  ${item.rate.toFixed(4)} / 1k
                </span>
              </span>
            );
          }}
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
            value={formattedCharge}
            className="w-full bg-transparent outline-none font-semibold text-[#7FFF00]"
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
