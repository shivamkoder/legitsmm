"use client";

import React, { useEffect, useRef, useState } from "react";
import { LayoutGrid, ChevronDown } from "lucide-react";
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

type Platform = {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
};

const mainPlatforms: Platform[] = [
  { id: "instagram", label: "Instagram", icon: SiInstagram, color: "#E1306C" },
  { id: "telegram", label: "Telegram", icon: SiTelegram, color: "#2AABEE" },
  { id: "facebook", label: "Facebook", icon: SiFacebook, color: "#1877F2" },
  { id: "youtube", label: "YouTube", icon: SiYoutube, color: "#FF0000" },
  { id: "x", label: "X", icon: SiX, color: "#FFFFFF" },
  { id: "tiktok", label: "TikTok", icon: SiTiktok, color: "#FFFFFF" },
  { id: "spotify", label: "Spotify", icon: SiSpotify, color: "#1DB954" },
  { id: "twitch", label: "Twitch", icon: SiTwitch, color: "#9146FF" },
];

const otherPlatforms: Platform[] = [
  { id: "pinterest", label: "Pinterest", icon: SiPinterest, color: "#E60023" },
  { id: "snapchat", label: "Snapchat", icon: SiSnapchat, color: "#FFFC00" },
  { id: "discord", label: "Discord", icon: SiDiscord, color: "#5865F2" },
  { id: "reddit", label: "Reddit", icon: SiReddit, color: "#FF4500" },
  { id: "whatsapp", label: "WhatsApp", icon: SiWhatsapp, color: "#25D366" },
];

const pillBase =
  "flex items-center gap-2 rounded-xl border px-4 py-2.5 text-[13px] transition-colors outline-none focus-visible:ring-1 focus-visible:ring-[#7FFF00]/60";

const pillClass = (active: boolean) =>
  `${pillBase} ${
    active
      ? "border-[#7FFF00]/50 bg-[#7FFF00]/10 text-[#7FFF00]"
      : "border-[#7FFF00]/15 bg-[#050a02] text-white/80 hover:border-[#7FFF00]/30 hover:text-white"
  }`;

export function PlatformFilter({
  value = "all",
  onChange,
}: {
  value?: string;
  onChange?: (id: string) => void;
}) {
  const [othersOpen, setOthersOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOthersOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const select = (id: string) => {
    onChange?.(id);
    setOthersOpen(false);
  };

  const othersActive = otherPlatforms.some((p) => p.id === value);

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {/* All */}
      <button
        type="button"
        onClick={() => select("all")}
        aria-pressed={value === "all"}
        className={pillClass(value === "all")}
      >
        <LayoutGrid className="h-4 w-4" strokeWidth={1.5} />
        All
      </button>

      {/* Main platforms */}
      {mainPlatforms.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => select(p.id)}
          aria-pressed={value === p.id}
          className={pillClass(value === p.id)}
        >
          <p.icon className="h-4 w-4" style={{ color: p.color }} />
          {p.label}
        </button>
      ))}

      {/* Others dropdown */}
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => setOthersOpen((o) => !o)}
          aria-expanded={othersOpen}
          className={pillClass(othersActive)}
        >
          {othersActive
            ? otherPlatforms.find((p) => p.id === value)?.label
            : "Others"}
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              othersOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {othersOpen && (
          <div className="absolute left-0 top-full z-50 mt-2 w-48 rounded-xl border border-[#7FFF00]/20 bg-[#050a02] p-2 shadow-lg">
            {otherPlatforms.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => select(p.id)}
                className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-[13px] text-white/80 hover:bg-[#7FFF00]/10 hover:text-white"
              >
                <p.icon className="h-4 w-4" style={{ color: p.color }} />
                {p.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
