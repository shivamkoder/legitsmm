"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { LayoutGrid, ChevronDown, Filter, Search, Check } from "lucide-react";
import {
  SiInstagram,
  SiTelegram,
  SiFacebook,
  SiYoutube,
  SiX,
  SiTiktok,
  SiSpotify,
  SiTwitch,
  SiPinterest,
  SiSnapchat,
  SiDiscord,
  SiReddit,
  SiWhatsapp,
} from "react-icons/si";

type Platform = { id: string; label: string; icon: React.ElementType; color: string };

// Same order as the reference screenshot
const mainPlatforms: Platform[] = [
  { id: "instagram", label: "Instagram", icon: SiInstagram, color: "#E1306C" },
  { id: "youtube", label: "YouTube", icon: SiYoutube, color: "#FF0000" },
  { id: "facebook", label: "Facebook", icon: SiFacebook, color: "#1877F2" },
  { id: "x", label: "X", icon: SiX, color: "#FFFFFF" },
  { id: "tiktok", label: "TikTok", icon: SiTiktok, color: "#FFFFFF" },
  { id: "telegram", label: "Telegram", icon: SiTelegram, color: "#2AABEE" },
  { id: "spotify", label: "Spotify", icon: SiSpotify, color: "#1DB954" },
];

const otherPlatforms: Platform[] = [
  { id: "twitch", label: "Twitch", icon: SiTwitch, color: "#9146FF" },
  { id: "pinterest", label: "Pinterest", icon: SiPinterest, color: "#E60023" },
  { id: "snapchat", label: "Snapchat", icon: SiSnapchat, color: "#FFFC00" },
  { id: "discord", label: "Discord", icon: SiDiscord, color: "#5865F2" },
  { id: "reddit", label: "Reddit", icon: SiReddit, color: "#FF4500" },
  { id: "whatsapp", label: "WhatsApp", icon: SiWhatsapp, color: "#25D366" },
];

type Service = {
  id: string;
  platform: string;
  name: string;
  rate: number; // per 1000
  min: number;
  max: number;
};

// Placeholder data. Replace with real services from Supabase later.
const allServices: Service[] = [
  { id: "777", platform: "instagram", name: "Instagram Followers (Instant, 1-3K/day, No Refill)", rate: 1.95, min: 100, max: 100000 },
  { id: "778", platform: "instagram", name: "Instagram Likes (Instant)", rate: 0.5, min: 50, max: 50000 },
  { id: "779", platform: "instagram", name: "Instagram Views (Instant)", rate: 0.1, min: 100, max: 1000000 },
  { id: "801", platform: "youtube", name: "YouTube Views (Non-Drop)", rate: 2.4, min: 500, max: 500000 },
  { id: "802", platform: "youtube", name: "YouTube Subscribers", rate: 14.0, min: 50, max: 20000 },
  { id: "821", platform: "tiktok", name: "TikTok Likes (Instant)", rate: 0.8, min: 50, max: 100000 },
  { id: "822", platform: "tiktok", name: "TikTok Followers", rate: 3.2, min: 100, max: 50000 },
  { id: "841", platform: "telegram", name: "Telegram Channel Members", rate: 1.2, min: 100, max: 100000 },
  { id: "861", platform: "x", name: "X Followers", rate: 6.5, min: 100, max: 20000 },
  { id: "881", platform: "facebook", name: "Facebook Page Likes", rate: 3.9, min: 100, max: 50000 },
  { id: "901", platform: "spotify", name: "Spotify Plays", rate: 1.1, min: 1000, max: 1000000 },
  { id: "921", platform: "twitch", name: "Twitch Followers", rate: 5.0, min: 50, max: 10000 },
];

type Sort = "default" | "price-asc" | "price-desc" | "min-asc";
export const allServices: Service[] = [
const sortOptions: { id: Sort; label: string }[] = [
  { id: "default", label: "Default" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "min-asc", label: "Lowest minimum" },
];

const pillBase =
  "flex items-center gap-2 rounded-xl border px-4 py-2.5 text-[13px] transition-colors outline-none focus-visible:ring-1 focus-visible:ring-[#7FFF00]/60";
const pillClass = (active: boolean) =>
  `${pillBase} ${
    active
      ? "border-[#7FFF00]/50 bg-[#7FFF00]/10 text-[#7FFF00]"
      : "border-[#7FFF00]/15 bg-[#050a02] text-white/80 hover:border-[#7FFF00]/30 hover:text-white"
  }`;

function useClickOutside(ref: React.RefObject<HTMLDivElement | null>, onOut: () => void) {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onOut();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, onOut]);
}

function OthersDropdown({
  value,
  onSelect,
}: {
  value: string;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false));
  const active = otherPlatforms.find((p) => p.id === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={pillClass(!!active)}
      >
        {active ? active.label : "Others"}
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-48 rounded-xl border border-[#7FFF00]/20 bg-[#050a02] p-2 shadow-lg">
          {otherPlatforms.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                onSelect(p.id);
                setOpen(false);
              }}
              className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-[13px] text-white/80 hover:bg-[#7FFF00]/10 hover:text-white"
            >
              <p.icon className="h-4 w-4" style={{ color: p.color }} />
              {p.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function MoreFilter({ value, onChange }: { value: Sort; onChange: (s: Sort) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false));

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={pillClass(value !== "default")}
      >
        <Filter className="h-4 w-4" fill="currentColor" strokeWidth={1.5} />
        More Filter
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-[#7FFF00]/20 bg-[#050a02] p-2 shadow-lg">
          <p className="px-2 pb-1 pt-1 text-xs text-[#7FFF00]/60">Sort by</p>
          {sortOptions.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => {
                onChange(o.id);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between rounded-md px-2 py-2 text-[13px] hover:bg-[#7FFF00]/10 ${
                o.id === value ? "text-[#7FFF00]" : "text-white/80"
              }`}
            >
              {o.label}
              {o.id === value && <Check className="h-4 w-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const cols =
  "grid grid-cols-[70px_minmax(220px,4fr)_110px_110px_110px_100px] items-center gap-4 px-5";

export function Services({ onNavigate }: { onNavigate?: (id: string) => void }) {
  const [platform, setPlatform] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("default");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = allServices.filter(
      (s) =>
        (platform === "all" || s.platform === platform) &&
        (!q || s.name.toLowerCase().includes(q) || s.id.includes(q)),
    );
    if (sort === "price-asc") list.sort((a, b) => a.rate - b.rate);
    if (sort === "price-desc") list.sort((a, b) => b.rate - a.rate);
    if (sort === "min-asc") list.sort((a, b) => a.min - b.min);
    return list;
  }, [platform, query, sort]);

  return (
    <div className="flex flex-col gap-5">
      {/* Platform row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setPlatform("all")}
            aria-pressed={platform === "all"}
            className={pillClass(platform === "all")}
          >
            <LayoutGrid className="h-4 w-4" strokeWidth={1.5} />
            All
          </button>

          {mainPlatforms.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPlatform(p.id)}
              aria-pressed={platform === p.id}
              className={pillClass(platform === p.id)}
            >
              <p.icon className="h-4 w-4" style={{ color: p.color }} />
              {p.label}
            </button>
          ))}

          <OthersDropdown value={platform} onSelect={setPlatform} />
        </div>

        <MoreFilter value={sort} onChange={setSort} />
      </div>

      {/* Search */}
      <div className="flex w-full items-center gap-3 rounded-xl border border-[#7FFF00]/15 bg-[#050a02] px-4 transition-colors focus-within:border-[#7FFF00]/40">
        <Search className="h-5 w-5 shrink-0 text-[#7FFF00]" strokeWidth={1.75} />
        <span className="h-6 w-px bg-[#7FFF00]/15" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
          className="w-full bg-transparent py-3.5 text-[13px] text-white/90 outline-none placeholder:text-white/40"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-[#7FFF00]/15 bg-[#050a02]">
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <div className={`${cols} h-11 bg-black text-[13px] font-semibold text-white`}>
              <span>ID</span>
              <span>Service</span>
              <span>Rate / 1000</span>
              <span>Min</span>
              <span>Max</span>
              <span />
            </div>

            {visible.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center gap-2">
                <h3 className="text-xl font-semibold text-white">No services found</h3>
                <p className="text-[13px] text-white/60">Try a different platform or search.</p>
              </div>
            ) : (
              visible.map((s) => (
                <div
                  key={s.id}
                  className={`${cols} border-t border-[#7FFF00]/10 py-3.5 text-[13px] text-white/80`}
                >
                  <span className="w-fit rounded-full bg-[#7FFF00]/20 px-2 py-0.5 text-[11px] font-semibold text-[#7FFF00]">
                    {s.id}
                  </span>
                  <span className="truncate" title={s.name}>
                    {s.name}
                  </span>
                  <span className="text-white">${s.rate.toFixed(2)}</span>
                  <span>{s.min.toLocaleString()}</span>
                  <span>{s.max.toLocaleString()}</span>
                  <button
                    type="button"
                    onClick={() => onNavigate?.("new-order")}
                    className="rounded-lg bg-[#7FFF00] px-3 py-1.5 text-xs font-semibold text-black transition-colors hover:bg-[#7FFF00]/85"
                  >
                    Order
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
