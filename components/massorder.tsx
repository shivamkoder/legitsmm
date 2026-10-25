"use client";

import React, { useMemo, useState } from "react";
import { Layers, CheckCircle2, AlertCircle } from "lucide-react";
import ArrowFillButton from "@/components/goodbutton";
import { allServices } from "@/components/services";

const card = "rounded-2xl border border-[#7FFF00]/15 bg-[#050a02]";
const MAX_LINES = 100;

type Row = {
  line: number;
  raw: string;
  serviceId: string;
  serviceName?: string;
  quantity: number;
  link: string;
  charge: number;
  error?: string;
};

// Format per line:  service_id | quantity | link
function parse(text: string): Row[] {
  const rows: Row[] = [];
  text.split("\n").forEach((raw, i) => {
    if (!raw.trim()) return;
    const [id = "", qtyStr = "", ...rest] = raw.split("|").map((p) => p.trim());
    const link = rest.join("|").trim();
    const qty = Number(qtyStr);
    const service = allServices.find((s) => s.id === id);

    let error: string | undefined;
    if (!id || !qtyStr || !link) error = "Use: service_id | quantity | link";
    else if (!service) error = `Service ${id} not found`;
    else if (!Number.isInteger(qty) || qty <= 0) error = "Quantity must be a whole number";
    else if (qty < service.min) error = `Min is ${service.min.toLocaleString()}`;
    else if (qty > service.max) error = `Max is ${service.max.toLocaleString()}`;

    rows.push({
      line: i + 1,
      raw,
      serviceId: id,
      serviceName: service?.name,
      quantity: Number.isFinite(qty) ? qty : 0,
      link,
      charge: !error && service ? (qty / 1000) * service.rate : 0,
      error,
    });
  });
  return rows;
}

export function MassOrder() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const rows = useMemo(() => parse(text), [text]);
  const errors = rows.filter((r) => r.error).length;
  const total = rows.reduce((sum, r) => sum + r.charge, 0);
  const tooMany = rows.length > MAX_LINES;
  const canSubmit = rows.length > 0 && errors === 0 && !tooMany && !loading;

  const submit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setMessage(null);
    try {
      // TODO: POST rows.map(({serviceId, quantity, link}) => ...) to /api/orders/mass.
      // The server must re-validate every line, recompute the price, check the
      // balance and create all orders in one transaction. Never trust the browser.
      console.log(rows.map((r) => ({ service: r.serviceId, quantity: r.quantity, link: r.link })));
      setMessage(`${rows.length} orders ready to submit (server not connected yet).`);
      setText("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-2">
      {/* Input */}
      <div className={`${card} overflow-hidden`}>
        <div className="relative flex items-center gap-3 border-b border-[#7FFF00]/15 px-5 py-4">
          <span className="absolute left-0 top-1/2 h-7 w-[3px] -translate-y-1/2 rounded-r bg-[#7FFF00]" />
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#7FFF00]/25 bg-[#7FFF00]/10">
            <Layers className="h-5 w-5 text-[#7FFF00]" strokeWidth={1.5} />
          </span>
          <div>
            <h2 className="text-[15px] font-semibold text-white">Mass order</h2>
            <p className="text-[12px] text-white/50">One order per line, up to {MAX_LINES}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 p-5">
          <div className="rounded-xl border border-[#7FFF00]/10 bg-black/40 p-3.5 text-[12px] text-white/70">
            <p className="mb-1.5 font-semibold text-[#7FFF00]">Format</p>
            <p className="font-mono text-white/90">service_id | quantity | link</p>
            <p className="mt-2 font-mono text-white/50">
              777 | 1000 | https://instagram.com/username
              <br />
              778 | 500 | https://instagram.com/p/abc123
            </p>
          </div>

          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setMessage(null);
            }}
            rows={12}
            spellCheck={false}
            placeholder="777 | 1000 | https://instagram.com/username"
            className="w-full resize-y rounded-xl border border-[#7FFF00]/15 bg-black/40 px-4 py-3.5 font-mono text-[13px] text-white/90 outline-none transition-colors placeholder:text-white/30 focus:border-[#7FFF00]/40"
          />

          {tooMany && (
            <p className="text-xs text-red-400">Maximum {MAX_LINES} orders per submission.</p>
          )}
          {message && <p className="text-xs text-[#7FFF00]">{message}</p>}

          <div className="flex items-center justify-between rounded-xl border border-[#7FFF00]/15 bg-gradient-to-r from-[#7FFF00]/10 to-[#7FFF00]/[0.03] px-4 py-4">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#7FFF00]/80">
              Total · {rows.length} {rows.length === 1 ? "order" : "orders"}
            </span>
            <span className="text-2xl font-bold text-[#7FFF00]">${total.toFixed(2)}</span>
          </div>

          <div className={canSubmit ? "" : "pointer-events-none opacity-50"}>
            <ArrowFillButton
              btnText={loading ? "Submitting..." : "Submit all orders"}
              href="#"
              role="button"
              onClick={(e) => {
                e.preventDefault();
                submit();
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
        </div>
      </div>

      {/* Preview */}
      <div className={`${card} overflow-hidden`}>
        <div className="flex items-center justify-between border-b border-[#7FFF00]/15 px-5 py-4">
          <h2 className="text-[15px] font-semibold text-white">Preview</h2>
          {rows.length > 0 && (
            <span className={`text-[12px] ${errors ? "text-red-400" : "text-[#7FFF00]"}`}>
              {errors ? `${errors} with errors` : "All valid"}
            </span>
          )}
        </div>

        {rows.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-[13px] text-white/50">
            Your orders will appear here as you type.
          </div>
        ) : (
          <ul className="max-h-[560px] overflow-y-auto [&::-webkit-scrollbar]:hidden">
            {rows.map((r) => (
              <li
                key={r.line}
                className="flex items-start gap-3 border-t border-[#7FFF00]/10 px-5 py-3.5 text-[13px] first:border-t-0"
              >
                {r.error ? (
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                ) : (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#7FFF00]" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-white/90" title={r.serviceName ?? r.raw}>
                    <span className="mr-2 rounded-full bg-[#7FFF00]/20 px-2 py-0.5 text-[11px] font-semibold text-[#7FFF00]">
                      {r.serviceId || "?"}
                    </span>
                    {r.serviceName ?? r.raw}
                  </p>
                  {r.error ? (
                    <p className="mt-1 text-xs text-red-400">
                      Line {r.line}: {r.error}
                    </p>
                  ) : (
                    <p className="mt-1 truncate text-xs text-white/50" title={r.link}>
                      {r.quantity.toLocaleString()} · {r.link}
                    </p>
                  )}
                </div>
                {!r.error && (
                  <span className="shrink-0 font-semibold text-white">${r.charge.toFixed(2)}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
