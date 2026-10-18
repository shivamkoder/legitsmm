"use client";

import React, { useRef, useState } from "react";
import { Headset, Bot, Paperclip, Check, X, ChevronDown, Search } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

// Replace with your real values.
const WHATSAPP_NUMBER = "+00 0000 000000";
const WHATSAPP_LINK = "https://wa.me/000000000000";

const card = "rounded-2xl border border-[#7FFF00]/15 bg-[#050a02]";
const field =
  "flex w-full items-center rounded-xl border border-[#7FFF00]/15 bg-black/40 text-[13px] text-white/90 transition-colors focus-within:border-[#7FFF00]/40";

const categories = [
  { id: "nora", label: "Nora (AI Support)" },
  { id: "order", label: "Order (Human Support)" },
  { id: "payment", label: "Payment" },
  { id: "account", label: "Account" },
  { id: "other", label: "Other" },
];

const tips = [
  { n: "01", title: "Use the correct command format", text: "Only supported command formats are processed." },
  { n: "02", title: "Keep your message command-only", text: "Do not add additional text or explanations." },
  { n: "03", title: "Only refill and speed requests", text: "Other requests should be sent to human support." },
  { n: "04", title: "Multiple orders are supported", text: "Separate multiple order IDs with commas." },
];

const correct = ["123456 refill", "789012 speed", "23456, 34566 refill", "23456, 34566 speed"];
const wrong = [
  "refill 123456",
  "speed 789012",
  "Hi, please refill this order 123456",
  "123456 my order is not moving",
];

type TicketStatus = "open" | "answered" | "closed";
export type Ticket = {
  id: string;
  category: string;
  subject: string;
  status: TicketStatus;
  updatedAt: string; // ISO date
};

const statusStyle: Record<TicketStatus, string> = {
  open: "bg-yellow-500/15 text-yellow-400",
  answered: "bg-[#7FFF00]/15 text-[#7FFF00]",
  closed: "bg-white/10 text-white/60",
};

const statusLabel: Record<TicketStatus, string> = {
  open: "Open",
  answered: "Answered",
  closed: "Closed",
};

const ticketCols =
  "grid grid-cols-[80px_minmax(140px,1.5fr)_minmax(200px,3fr)_110px_minmax(150px,1.5fr)] items-center gap-4 px-5";

function CardHeader({
  icon: Icon,
  title,
  subtitle,
  tone = "lime",
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  tone?: "lime" | "violet";
}) {
  const iconWrap =
    tone === "violet"
      ? "bg-violet-500/15 border-violet-400/30 text-violet-300"
      : "bg-[#7FFF00]/10 border-[#7FFF00]/25 text-[#7FFF00]";
  return (
    <div className="relative flex items-center gap-3 border-b border-[#7FFF00]/15 px-5 py-4">
      <span className="absolute left-0 top-1/2 h-7 w-[3px] -translate-y-1/2 rounded-r bg-[#7FFF00]" />
      <span className={`flex h-10 w-10 items-center justify-center rounded-xl border ${iconWrap}`}>
        <Icon className="h-5 w-5" strokeWidth={1.5} />
      </span>
      <div className="min-w-0">
        <h2 className="text-[15px] font-semibold text-white">{title}</h2>
        <p className="text-[12px] text-white/50">{subtitle}</p>
      </div>
    </div>
  );
}

export function Tickets({ tickets = [] }: { tickets?: Ticket[] }) {
  // TODO: load tickets from Supabase (tickets table, RLS by user) and pass them in
  const [category, setCategory] = useState(categories[0].id);
  const [catOpen, setCatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const isNora = category === "nora";
  const current = categories.find((c) => c.id === category) ?? categories[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setError("Please describe your problem.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      // TODO: POST { category, message, files } to /api/tickets.
      // The server must validate the user and, for Nora, parse the command.
      console.log({ category, message: message.trim(), files: files.map((f) => f.name) });
      setMessage("");
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-[#7FFF00]/20 bg-gradient-to-br from-[#0d2a05] via-[#071a03] to-black p-6">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="min-w-0 max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#7FFF00]/25 bg-[#7FFF00]/10">
                <Headset className="h-5 w-5 text-[#7FFF00]" strokeWidth={1.5} />
              </span>
              <h1 className="text-2xl font-bold text-white">Support Center</h1>
            </div>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-1.5 text-[13px] text-white/75">
              {[
                "Our support is online between GMT+3 10:00 - 03:00.",
                "Your internal tickets will be replied within 0-15 minutes.",
                "Your Live Chat tickets will be replied within 0-5 minutes.",
                "We're assisting order related issues through internal ticket system.",
              ].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#7FFF00]" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noreferrer"
            className="w-full rounded-2xl border border-[#7FFF00]/20 bg-black/30 p-4 backdrop-blur transition-colors hover:border-[#7FFF00]/40 sm:w-72"
          >
            <p className="text-[12px] text-white/60">Do you have your own panel?</p>
            <div className="mt-3 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white">
                <SiWhatsapp className="h-6 w-6 text-[#25D366]" />
              </span>
              <div>
                <p className="text-[13px] font-semibold text-white">Get in touch with us!</p>
                <p className="text-[12px] text-white/60">{WHATSAPP_NUMBER}</p>
              </div>
            </div>
          </a>
        </div>
      </div>

      {/* Create ticket + Nora */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Create ticket */}
        <form onSubmit={handleSubmit} className={`${card} overflow-hidden`}>
          <CardHeader
            icon={Headset}
            title="Create ticket"
            subtitle="Please clearly state your problem"
          />
          <div className="flex flex-col gap-5 p-5">
            <div>
              <label className="mb-2 block text-[13px] font-medium text-white">Category</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setCatOpen((o) => !o)}
                  aria-expanded={catOpen}
                  className={`${field} justify-between px-4 py-3.5 text-left outline-none focus-visible:ring-1 focus-visible:ring-[#7FFF00]/60`}
                >
                  <span className="truncate">{current.label}</span>
                  <ChevronDown
                    className={`ml-3 h-4 w-4 shrink-0 text-[#7FFF00]/60 transition-transform ${
                      catOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {catOpen && (
                  <div className="absolute left-0 top-full z-50 mt-2 w-full rounded-xl border border-[#7FFF00]/20 bg-[#050a02] p-2 shadow-lg">
                    {categories.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setCategory(c.id);
                          setCatOpen(false);
                        }}
                        className={`flex w-full items-center rounded-md px-2 py-2 text-left text-[13px] hover:bg-[#7FFF00]/10 ${
                          c.id === category ? "text-[#7FFF00]" : "text-white/80"
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="ticket-message" className="mb-2 block text-[13px] font-medium text-white">
                Message
              </label>
              <textarea
                id="ticket-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={7}
                placeholder={isNora ? "123456 refill" : "Describe your problem"}
                className={`${field} resize-y px-4 py-3.5 outline-none placeholder:text-white/30`}
              />
            </div>

            <div>
              <input
                ref={fileRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 rounded-lg px-1 py-1 text-[13px] text-white outline-none hover:text-[#7FFF00] focus-visible:ring-1 focus-visible:ring-[#7FFF00]/60"
              >
                <Paperclip className="h-4 w-4 text-[#7FFF00]" strokeWidth={1.75} />
                Attach files
              </button>
              {files.length > 0 && (
                <p className="mt-1 truncate text-xs text-white/50">
                  {files.map((f) => f.name).join(", ")}
                </p>
              )}
            </div>

            {error && <p className="text-xs text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-[#7FFF00] to-[#4fb800] py-3.5 text-[13px] font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-60 outline-none focus-visible:ring-2 focus-visible:ring-[#7FFF00]/60"
            >
              {loading ? "Submitting..." : "Submit ticket"}
            </button>
          </div>
        </form>

        {/* Nora */}
        <div className={`${card} overflow-hidden`}>
          <CardHeader
            icon={Bot}
            title="Nora (AI Powered)"
            subtitle="Your AI Powered Ticket Assistant"
            tone="violet"
          />
          <div className="flex flex-col gap-5 p-5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {tips.map((t) => (
                <div
                  key={t.n}
                  className="flex items-start gap-3 rounded-xl border border-[#7FFF00]/10 bg-black/40 p-3.5"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/15 text-[11px] font-semibold text-violet-300">
                    {t.n}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-[#7FFF00]">{t.title}</p>
                    <p className="mt-0.5 text-[12px] text-white/70">{t.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="overflow-hidden rounded-xl border border-[#7FFF00]/20 bg-[#7FFF00]/[0.03]">
                <div className="flex items-center gap-3 p-3.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7FFF00]/15">
                    <Check className="h-4 w-4 text-[#7FFF00]" strokeWidth={2.5} />
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold text-[#7FFF00]">Correct format</p>
                    <p className="text-[11px] text-[#7FFF00]/60">Commands Nora can process</p>
                  </div>
                </div>
                <ul className="space-y-2 border-t border-[#7FFF00]/15 p-3.5 font-mono text-[12px] text-[#7FFF00]/90">
                  {correct.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>

              <div className="overflow-hidden rounded-xl border border-red-500/25 bg-red-500/[0.04]">
                <div className="flex items-center gap-3 p-3.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/15">
                    <X className="h-4 w-4 text-red-400" strokeWidth={2.5} />
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold text-red-400">Wrong format</p>
                    <p className="text-[11px] text-red-400/60">These commands will not be processed</p>
                  </div>
                </div>
                <ul className="space-y-2 border-t border-red-500/20 p-3.5 font-mono text-[12px] text-red-400/90">
                  {wrong.map((w) => (
                    <li key={w}>{w}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket history */}
      <TicketHistory tickets={tickets} />
    </div>
  );
}

function TicketHistory({ tickets }: { tickets: Ticket[] }) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const visible = tickets.filter(
    (t) =>
      !q ||
      t.id.toLowerCase().includes(q) ||
      t.subject.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q),
  );

  return (
    <div className={`${card} overflow-hidden`}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#7FFF00]/15 px-5 py-4">
        <h2 className="text-[15px] font-semibold text-white">Your tickets</h2>
        <div className="flex w-full items-center rounded-xl border border-[#7FFF00]/15 bg-black/40 px-3 transition-colors focus-within:border-[#7FFF00]/40 sm:w-64">
          <Search className="h-4 w-4 shrink-0 text-[#7FFF00]" strokeWidth={1.75} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="w-full bg-transparent px-3 py-2.5 text-[13px] text-white/90 outline-none placeholder:text-white/40"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[720px]">
          <div className={`${ticketCols} h-11 bg-black text-[13px] font-semibold text-white`}>
            <span>ID</span>
            <span>Category</span>
            <span>Subject</span>
            <span>Status</span>
            <span>Last update</span>
          </div>

          {visible.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center gap-1">
              <p className="text-base font-semibold text-white">No tickets yet</p>
              <p className="text-[13px] text-white/60">Create a ticket above and it will show up here.</p>
            </div>
          ) : (
            visible.map((t) => (
              <div
                key={t.id}
                className={`${ticketCols} border-t border-[#7FFF00]/10 py-3.5 text-[13px] text-white/80`}
              >
                <span className="text-white">{t.id}</span>
                <span className="truncate">{t.category}</span>
                <span className="truncate" title={t.subject}>
                  {t.subject}
                </span>
                <span
                  className={`w-fit rounded-full px-2.5 py-1 text-[11px] font-medium ${statusStyle[t.status]}`}
                >
                  {statusLabel[t.status]}
                </span>
                <span className="text-white/60">{new Date(t.updatedAt).toLocaleString()}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
