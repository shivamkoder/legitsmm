import React from "react";
import { cn } from "@/lib/utils";

const cardContents = [
  {
    title: "Every platform, one dashboard",
    description:
      "Instagram, YouTube, TikTok, Telegram, Facebook, X, Spotify and more. Order, track and top up from one place without juggling tools.",
  },
  {
    title: "Clear pricing",
    description:
      "Every service shows its rate per 1000, plus its minimum and maximum, before you pay. No hidden charges at checkout.",
  },
  {
    title: "Built for resellers and power users",
    description:
      "Place up to 100 orders at once with Mass order, connect your own panel or scripts through the API, and earn commission with the affiliate program. Refill options are available on supported services.",
  },
  {
    title: "Secure payments",
    description:
      "Deposits go through trusted payment gateways. We never see or store your card details.",
  },
  {
    title: "Real support",
    description:
      "Open a ticket from your dashboard and our team will help with orders, payments and refills.",
  },
];

const PlusCard: React.FC<{
  className?: string;
  title: string;
  description: string;
}> = ({ className = "", title, description }) => {
  return (
    <div
      className={cn(
        "relative flex min-h-[200px] flex-col justify-between rounded-lg border border-dashed border-[#7FFF00]/30 bg-[#050a02] p-6 transition-colors hover:border-[#7FFF00]/60",
        className,
      )}
    >
      <CornerPlusIcons />
      <div className="relative z-10 space-y-2">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-white/70">{description}</p>
      </div>
    </div>
  );
};

const CornerPlusIcons = () => (
  <>
    <PlusIcon className="absolute -top-3 -left-3" />
    <PlusIcon className="absolute -top-3 -right-3" />
    <PlusIcon className="absolute -bottom-3 -left-3" />
    <PlusIcon className="absolute -bottom-3 -right-3" />
  </>
);

const PlusIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    width={24}
    height={24}
    strokeWidth="1"
    stroke="currentColor"
    aria-hidden="true"
    className={cn("size-6 text-[#7FFF00]", className)}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
  </svg>
);

export default function InfoCards() {
  return (
    <section className="border border-[#7FFF00]/15 bg-black">
      <div className="container mx-auto border-t-0 px-4 py-12">
        <div className="grid auto-rows-auto grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <PlusCard {...cardContents[0]} className="lg:col-span-3 lg:row-span-2" />
          <PlusCard {...cardContents[1]} className="lg:col-span-2 lg:row-span-2" />
          <PlusCard {...cardContents[2]} className="lg:col-span-4 lg:row-span-1" />
          <PlusCard {...cardContents[3]} className="lg:col-span-2 lg:row-span-1" />
          <PlusCard {...cardContents[4]} className="lg:col-span-2 lg:row-span-1" />
        </div>

        <div className="mt-6 ml-auto max-w-2xl px-4 text-right lg:-mt-20">
          <h2 className="mb-4 text-4xl font-bold text-[#7FFF00] md:text-6xl">
            Built for speed. Designed for growth.
          </h2>
          <p className="text-lg text-white/60">
            Legit SMM puts everything you need to grow your public profiles in one simple panel,
            from first order to repeat refills.
          </p>
        </div>
      </div>
    </section>
  );
}
