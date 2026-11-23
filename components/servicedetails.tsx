import React from "react";
import { Check, X, Zap, PlusCircle, HeartPulse, Users, Bot, Sparkles, Shuffle } from "lucide-react";
import {
  SiInstagram,
  SiYoutube,
  SiTiktok,
  SiTelegram,
  SiFacebook,
  SiX,
  SiSpotify,
  SiTwitch,
  SiPinterest,
  SiSnapchat,
  SiDiscord,
  SiReddit,
  SiWhatsapp,
} from "react-icons/si";
import type { ServiceItem } from "@/components/orderform";

const platformIcon: Record<string, { icon: React.ElementType; bg: string }> = {
  instagram: { icon: SiInstagram, bg: "bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5]" },
  youtube: { icon: SiYoutube, bg: "bg-[#FF0000]" },
  tiktok: { icon: SiTiktok, bg: "bg-black border border-white/20" },
  telegram: { icon: SiTelegram, bg: "bg-[#2AABEE]" },
  facebook: { icon: SiFacebook, bg: "bg-[#1877F2]" },
  x: { icon: SiX, bg: "bg-black border border-white/20" },
  spotify: { icon: SiSpotify, bg: "bg-[#1DB954]" },
  twitch: { icon: SiTwitch, bg: "bg-[#9146FF]" },
  pinterest: { icon: SiPinterest, bg: "bg-[#E60023]" },
  snapchat: { icon: SiSnapchat, bg: "bg-[#FFFC00] text-black" },
  discord: { icon: SiDiscord, bg: "bg-[#5865F2]" },
  reddit: { icon: SiReddit, bg: "bg-[#FF4500]" },
  whatsapp: { icon: SiWhatsapp, bg: "bg-[#25D366]" },
};

function Stat({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#7FFF00]/20 bg-black/60">
        <Icon className="h-5 w-5 text-sky-400" strokeWidth={1.75} />
      </span>
      <div className="min-w-0">
        <p className="text-[12px] text-white/50">{label}</p>
        <div className="text-[14px] font-semibold text-white">{children}</div>
      </div>
    </div>
  );
}

export function ServiceDetails({ service }: { service: ServiceItem | null }) {
  if (!service) {
    return (
      <div className="flex h-full min-h-[200px] items-center justify-center rounded-2xl border border-[#7FFF00]/15 bg-black/40 text-[13px] text-white/50">
        Select a service to see its details
      </div>
    );
  }

  const p = platformIcon[service.platform?.toLowerCase()] ?? platformIcon.instagram;
  const PIcon = p.icon;

  return (
    <div className="rounded-2xl border border-[#7FFF00]/15 bg-black/40 p-5 lg:sticky lg:top-0">
      {/* Header */}
      <div className="flex items-start gap-4">
        <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${p.bg}`}>
          <PIcon className="h-7 w-7 text-white" />
        </span>
        <div className="min-w-0">
          <p className="text-[13px] text-white/50">{service.id}</p>
          <h3 className="mt-0.5 text-[15px] font-semibold leading-snug text-white">
            {service.label} - ${service.rate.toFixed(4)}
          </h3>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Stat icon={PlusCircle} label="Start Time">
          {service.startTime}
        </Stat>
        <Stat icon={Zap} label="Speed">
          {service.speed}
        </Stat>
        <Stat icon={HeartPulse} label="Guaranteed">
          {service.refill ? (
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-[#7FFF00]" strokeWidth={2.5} />
              {service.refill} Refill
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <X className="h-4 w-4 text-red-400" strokeWidth={2.5} />
              No Refill
            </span>
          )}
        </Stat>
        <Stat icon={Users} label="Audience Type">
          {service.audience?.toLowerCase() === "organic" ? (
            <span className="flex items-center gap-1.5 text-[#7FFF00]">
              <Sparkles className="h-4 w-4 text-[#7FFF00]" strokeWidth={2} />
              Organic
            </span>
          ) : service.audience?.toLowerCase() === "mix" ? (
            <span className="flex items-center gap-1.5 text-sky-400">
              <Shuffle className="h-4 w-4 text-sky-400" strokeWidth={2} />
              Mix
            </span>
          ) : service.audience?.toLowerCase() === "bot" ? (
            <span className="flex items-center gap-1.5 text-amber-400">
              <Bot className="h-4 w-4 text-amber-400" strokeWidth={2} />
              Bot
            </span>
          ) : (
            <span className="text-white">{service.audience || "Organic"}</span>
          )}
        </Stat>
      </div>

      {/* Details */}
      <div className="mt-6 border-t border-[#7FFF00]/10 pt-4">
        <p className="text-[13px] text-white/50">Details</p>
        <p className="mt-1 text-[13px] text-white/90">Link : {service.linkHint}</p>
        <p className="mt-1 text-[13px] text-white/60">
          Min: {service.min.toLocaleString()} - Max: {service.max.toLocaleString()}
        </p>
        {service.type === "custom_comments" && (
          <p className="mt-1.5 text-[12px] text-[#7FFF00]/80">
            Custom Comments: Enter 1 comment per line; quantity is calculated automatically.
          </p>
        )}
      </div>
    </div>
  );
}
