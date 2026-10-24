import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Headset, Wallet, Zap } from "lucide-react";
import { LegalFooter } from "@/components/legal-footer";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: `About Us | ${LEGAL.brand}`,
  description: `${LEGAL.brand} is a social media marketing panel for creators, businesses and resellers.`,
};

const values = [
  {
    icon: Zap,
    title: "Fast to start",
    text: "Create an account, add funds and place your first order in minutes. Most services begin processing soon after you order.",
  },
  {
    icon: Wallet,
    title: "Clear pricing",
    text: "Every service shows its rate per 1000, minimum and maximum before you pay. No hidden charges added at checkout.",
  },
  {
    icon: ShieldCheck,
    title: "Secure payments",
    text: "Payments are handled by trusted gateways. We never see or store your card details or UPI PIN.",
  },
  {
    icon: Headset,
    title: "Real support",
    text: "Open a ticket from your dashboard and our team will help with orders, payments and refills.",
  },
];

const steps = [
  { n: "01", title: "Create your account", text: "Sign up with your email and confirm it." },
  { n: "02", title: "Add funds", text: "Top up your balance with any available payment method." },
  { n: "03", title: "Place an order", text: "Pick a service, paste your public link, choose a quantity and submit." },
];

export default function Page() {
  return (
    <div className="min-h-svh w-full bg-black text-white">
      <header className="border-b border-[#7FFF00]/15">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
          <Link href="/" className="text-[15px] font-semibold text-[#7FFF00]">
            {LEGAL.brand}
          </Link>
          <div className="flex items-center gap-4 text-[13px]">
            <Link href="/about" className="text-[#7FFF00]">About Us</Link>
            <Link
              href="/auth/login"
              className="rounded-lg border border-[#7FFF00]/30 px-3 py-1.5 text-[#7FFF00] hover:bg-[#7FFF00]/10"
            >
              Sign in
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-14">
        {/* Intro */}
        <section className="max-w-3xl">
          <h1 className="text-4xl font-bold text-[#7FFF00] md:text-5xl">About {LEGAL.brand}</h1>
          <p className="mt-6 text-[15px] leading-relaxed text-white/80">
            {LEGAL.brand} is a social media marketing panel built for creators, small businesses and
            resellers who want a simple way to boost the visibility of their public profiles and
            content. We bring services for Instagram, YouTube, TikTok, Telegram, Facebook, X, Spotify
            and more into one dashboard, so you can order, track and top up without juggling tools.
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-white/70">
            We are an independent business and are not affiliated with any of the platforms we
            support. Delivery times and results are estimates, and we are upfront about that in our{" "}
            <Link href="/disclaimer" className="text-[#7FFF00] hover:underline">Disclaimer</Link> and{" "}
            <Link href="/terms" className="text-[#7FFF00] hover:underline">Terms of Service</Link>.
          </p>
        </section>

        {/* Values */}
        <section className="mt-14">
          <h2 className="text-2xl font-semibold text-white">What you can expect</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {values.map((v) => (
              <div key={v.title} className="rounded-2xl border border-[#7FFF00]/15 bg-[#050a02] p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#7FFF00]/25 bg-[#7FFF00]/10">
                  <v.icon className="h-5 w-5 text-[#7FFF00]" strokeWidth={1.5} />
                </span>
                <h3 className="mt-4 text-[15px] font-semibold text-white">{v.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-white/60">{v.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="mt-14">
          <h2 className="text-2xl font-semibold text-white">How it works</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="rounded-2xl border border-[#7FFF00]/15 bg-black/40 p-5">
                <span className="text-[12px] font-semibold tracking-widest text-[#7FFF00]">{s.n}</span>
                <h3 className="mt-2 text-[15px] font-semibold text-white">{s.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-white/60">{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA + contact */}
        <section className="mt-14 rounded-2xl border border-[#7FFF00]/20 bg-gradient-to-br from-[#0d2a05] via-[#071a03] to-black p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-white">Ready to get started?</h2>
          <p className="mt-2 text-[14px] text-white/70">
            Create a free account and explore the services. Questions? Write to us at{" "}
            <a href={`mailto:${LEGAL.email}`} className="text-[#7FFF00] hover:underline">
              {LEGAL.email}
            </a>
            .
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/auth/sign-up"
              className="rounded-xl bg-[#7FFF00] px-6 py-3 text-[13px] font-semibold text-black hover:bg-[#7FFF00]/85"
            >
              Create account
            </Link>
            <Link
              href="/auth/login"
              className="rounded-xl border border-[#7FFF00]/30 px-6 py-3 text-[13px] font-semibold text-[#7FFF00] hover:bg-[#7FFF00]/10"
            >
              Sign in
            </Link>
          </div>
          <p className="mt-6 text-[12px] text-white/40">
            {LEGAL.brand} is operated by {LEGAL.legalName}. {LEGAL.address}
          </p>
        </section>
      </main>

      <LegalFooter />
    </div>
  );
}
