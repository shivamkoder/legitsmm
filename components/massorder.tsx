"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Layers,
  Plus,
  Trash2,
  Link2,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import ArrowFillButton from "@/components/goodbutton";
import { PLATFORM_CATEGORIES } from "@/components/orderform";
import { useServices, type DbService } from "@/lib/services";

const card = "rounded-2xl border border-[#7FFF00]/15 bg-[#050a02]";
const inputBase =
  "w-full rounded-xl border border-[#7FFF00]/15 bg-black/60 px-3 py-2.5 text-[13px] text-white/90 outline-none transition-colors placeholder:text-white/30 focus:border-[#7FFF00]/50";
const selectBase =
  "w-full appearance-none rounded-xl border border-[#7FFF00]/15 bg-black/60 pl-3 pr-8 py-2.5 text-[13px] text-white/90 outline-none transition-colors focus:border-[#7FFF00]/50 cursor-pointer";

const MAX_ROWS = 100;

const PLATFORMS = [
  { id: "instagram", label: "Instagram" },
  { id: "telegram", label: "Telegram" },
  { id: "facebook", label: "Facebook" },
  { id: "youtube", label: "YouTube" },
  { id: "x", label: "X" },
  { id: "tiktok", label: "TikTok" },
  { id: "spotify", label: "Spotify" },
  { id: "twitch", label: "Twitch" },
  { id: "pinterest", label: "Pinterest" },
  { id: "snapchat", label: "Snapchat" },
  { id: "discord", label: "Discord" },
  { id: "reddit", label: "Reddit" },
  { id: "whatsapp", label: "WhatsApp" },
];

type OrderRowState = {
  uid: string;
  platform: string;
  category: string;
  serviceId: string;
  link: string;
  quantity: string;
  comments: string;
};

type SubmitReport = {
  succeeded: { rowNum: number; orderId: number; charge: number }[];
  failed: { rowNum: number; error: string }[];
};

let rowCounter = 1;
function createRow(platform = "instagram", services: DbService[] = []): OrderRowState {
  const platServices = services.filter(
    (s) => s.platform.toLowerCase() === platform.toLowerCase(),
  );
  const first = platServices[0];
  return {
    uid: `row-${rowCounter++}-${Date.now()}`,
    platform,
    category: "all",
    serviceId: first ? String(first.id) : "",
    link: "",
    quantity: first ? String(first.min_qty) : "",
    comments: "",
  };
}

function getFilteredServices(
  services: DbService[],
  platform: string,
  category: string,
): DbService[] {
  const byPlatform = services.filter(
    (s) => s.platform.toLowerCase() === platform.toLowerCase(),
  );
  if (category === "all") return byPlatform;
  const target = category.toLowerCase();
  const root = target.endsWith("s") ? target.slice(0, -1) : target;
  return byPlatform.filter((s) => {
    const c = (s.category || "").toLowerCase();
    const n = (s.name || "").toLowerCase();
    return c === target || c.includes(root) || n.includes(root);
  });
}

function getCategoriesForPlatform(services: DbService[], platform: string): string[] {
  const key = platform.toLowerCase();
  const preset = PLATFORM_CATEGORIES[key] ?? [];
  const fromDb = [
    ...new Set(
      services
        .filter((s) => s.platform.toLowerCase() === key)
        .map((s) => s.category)
        .filter(Boolean),
    ),
  ];
  const extras = fromDb.filter(
    (c) => !preset.some((p) => p.toLowerCase() === c.toLowerCase()),
  );
  return [...preset, ...extras];
}

export function MassOrder() {
  const { services, loading: loadingServices, error: servicesError } = useServices();
  const [rows, setRows] = useState<OrderRowState[]>(() => [createRow("instagram")]);
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [report, setReport] = useState<SubmitReport | null>(null);

  // Once services load from Supabase, auto-populate any row that doesn't have a service selected yet.
  useEffect(() => {
    if (services.length === 0) return;
    setRows((prev) =>
      prev.map((row) => {
        if (row.serviceId) return row;
        const list = getFilteredServices(services, row.platform, row.category);
        const first = list[0];
        if (!first) return row;
        return {
          ...row,
          serviceId: String(first.id),
          quantity: row.quantity || String(first.min_qty),
        };
      }),
    );
  }, [services]);

  const updateRow = (uid: string, updater: (r: OrderRowState) => OrderRowState) => {
    setReport(null);
    setRows((prev) => prev.map((r) => (r.uid === uid ? updater(r) : r)));
  };

  const handlePlatformChange = (uid: string, nextPlatform: string) => {
    const list = getFilteredServices(services, nextPlatform, "all");
    const first = list[0];
    updateRow(uid, (r) => ({
      ...r,
      platform: nextPlatform,
      category: "all",
      serviceId: first ? String(first.id) : "",
      quantity: first ? String(first.min_qty) : "",
      comments: "",
    }));
  };

  const handleCategoryChange = (uid: string, nextCategory: string) => {
    updateRow(uid, (r) => {
      const list = getFilteredServices(services, r.platform, nextCategory);
      const first = list[0];
      return {
        ...r,
        category: nextCategory,
        serviceId: first ? String(first.id) : "",
        quantity: first ? String(first.min_qty) : "",
        comments: "",
      };
    });
  };

  const handleServiceChange = (uid: string, nextServiceId: string) => {
    const svc = services.find((s) => String(s.id) === nextServiceId);
    updateRow(uid, (r) => ({
      ...r,
      serviceId: nextServiceId,
      quantity: svc ? String(svc.min_qty) : r.quantity,
      comments: "",
    }));
  };

  const addRow = () => {
    if (rows.length >= MAX_ROWS) return;
    setReport(null);
    const lastPlatform = rows[rows.length - 1]?.platform ?? "instagram";
    setRows((prev) => [...prev, createRow(lastPlatform, services)]);
  };

  const removeRow = (uid: string) => {
    if (rows.length <= 1) return;
    setReport(null);
    setRows((prev) => prev.filter((r) => r.uid !== uid));
  };

  const evaluated = useMemo(() => {
    return rows.map((row) => {
      const service = services.find((s) => String(s.id) === row.serviceId) ?? null;
      const isCustomComments = service?.type === "custom_comments";
      const commentLines = row.comments
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
      const qty = isCustomComments ? commentLines.length : Number(row.quantity) || 0;

      let error: string | null = null;
      if (!service) {
        error = "Select a service";
      } else if (!row.link.trim()) {
        error = "Enter a link";
      } else if (!Number.isInteger(qty) || qty <= 0) {
        error = isCustomComments ? "Enter at least 1 comment" : "Enter a valid quantity";
      } else if (qty < service.min_qty) {
        error = `Min is ${service.min_qty.toLocaleString()}`;
      } else if (qty > service.max_qty) {
        error = `Max is ${service.max_qty.toLocaleString()}`;
      }

      const charge = !error && service ? (qty / 1000) * service.rate : 0;
      return { row, service, isCustomComments, commentLines, qty, charge, error };
    });
  }, [rows, services]);

  const errorCount = evaluated.filter((e) => e.error).length;
  const totalCharge = evaluated.reduce((sum, e) => sum + e.charge, 0);
  const canSubmit =
    evaluated.length > 0 &&
    errorCount === 0 &&
    !submitting &&
    !loadingServices;

  const submitAll = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setReport(null);

    const succeeded: SubmitReport["succeeded"] = [];
    const failed: SubmitReport["failed"] = [];

    try {
      for (let i = 0; i < evaluated.length; i++) {
        const item = evaluated[i];
        setProgress(`Submitting order ${i + 1} of ${evaluated.length}...`);

        const payload: Record<string, unknown> = {
          serviceId: item.service!.id,
          link: item.row.link.trim(),
          quantity: item.qty,
        };
        if (item.isCustomComments) {
          payload.extra = { comments: item.commentLines.join("\n") };
        }

        try {
          const res = await fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          const json = await res.json().catch(() => ({}));
          if (!res.ok) {
            failed.push({ rowNum: i + 1, error: json.error ?? "Failed to place order." });
          } else {
            succeeded.push({
              rowNum: i + 1,
              orderId: json.orderId,
              charge: Number(json.charge ?? item.charge),
            });
          }
        } catch (err) {
          failed.push({
            rowNum: i + 1,
            error: err instanceof Error ? err.message : "Network error",
          });
        }
      }

      setReport({ succeeded, failed });
      if (failed.length === 0) {
        setRows([createRow(rows[0]?.platform ?? "instagram", services)]);
      }
    } finally {
      setProgress(null);
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Main Mass Order Container */}
      <div className={`${card} overflow-hidden`}>
        {/* Header */}
        <div className="relative flex flex-wrap items-center justify-between gap-4 border-b border-[#7FFF00]/15 px-5 py-4">
          <span className="absolute left-0 top-1/2 h-7 w-[3px] -translate-y-1/2 rounded-r bg-[#7FFF00]" />
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#7FFF00]/25 bg-[#7FFF00]/10">
              <Layers className="h-5 w-5 text-[#7FFF00]" strokeWidth={1.5} />
            </span>
            <div>
              <h2 className="text-[15px] font-semibold text-white">Mass order</h2>
              <p className="text-[12px] text-white/50">
                Select services row by row — click + below to add up to {MAX_ROWS} orders
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full border border-[#7FFF00]/20 bg-[#7FFF00]/10 px-3 py-1 text-xs font-medium text-[#7FFF00]">
              {rows.length} {rows.length === 1 ? "order" : "orders"}
            </span>
            <span className="text-sm font-bold text-[#7FFF00]">
              Total: ${totalCharge.toFixed(4)}
            </span>
          </div>
        </div>

        {/* Column labels (desktop) */}
        <div className="hidden lg:grid lg:grid-cols-[36px_135px_145px_minmax(220px,2fr)_minmax(180px,1.5fr)_110px_90px_36px] items-center gap-3 border-b border-[#7FFF00]/10 bg-black/40 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-white/45">
          <span>#</span>
          <span>Platform</span>
          <span>Category</span>
          <span>Service</span>
          <span>Link</span>
          <span>Quantity</span>
          <span className="text-right">Charge</span>
          <span />
        </div>

        {/* Loading / Error Banner */}
        {loadingServices && (
          <div className="px-5 py-4 text-xs text-white/50">Loading services...</div>
        )}
        {servicesError && (
          <div className="px-5 py-4 text-xs text-red-400">
            Could not load services: {servicesError}
          </div>
        )}

        {/* Order Rows */}
        <div className="divide-y divide-[#7FFF00]/10">
          {evaluated.map((item, idx) => {
            const { row, service, isCustomComments, commentLines, charge, error } = item;
            const categories = getCategoriesForPlatform(services, row.platform);
            const serviceOptions = getFilteredServices(services, row.platform, row.category);

            return (
              <div key={row.uid} className="px-5 py-4 transition-colors hover:bg-[#7FFF00]/[0.02]">
                {/* Horizontal 1-Order Row */}
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-[36px_135px_145px_minmax(220px,2fr)_minmax(180px,1.5fr)_110px_90px_36px] lg:items-center">
                  {/* Row Number & Status */}
                  <div className="flex items-center justify-between lg:justify-start">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#7FFF00]/20 bg-[#7FFF00]/10 text-xs font-semibold text-[#7FFF00]">
                      {idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeRow(row.uid)}
                      disabled={rows.length <= 1}
                      aria-label={`Remove order ${idx + 1}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/20 text-red-400/70 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:pointer-events-none disabled:opacity-25 lg:hidden"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Platform */}
                  <div className="relative">
                    <label className="mb-1 block text-[11px] text-white/45 lg:hidden">
                      Platform
                    </label>
                    <select
                      value={row.platform}
                      onChange={(e) => handlePlatformChange(row.uid, e.target.value)}
                      className={selectBase}
                    >
                      {PLATFORMS.map((p) => (
                        <option key={p.id} value={p.id} className="bg-[#050a02] text-white">
                          {p.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-[34px] h-4 w-4 text-[#7FFF00]/60 lg:top-1/2 lg:-translate-y-1/2" />
                  </div>

                  {/* Category */}
                  <div className="relative">
                    <label className="mb-1 block text-[11px] text-white/45 lg:hidden">
                      Category
                    </label>
                    <select
                      value={row.category}
                      onChange={(e) => handleCategoryChange(row.uid, e.target.value)}
                      className={selectBase}
                    >
                      <option value="all" className="bg-[#050a02] text-white">
                        All Categories
                      </option>
                      {categories.map((c) => (
                        <option key={c} value={c} className="bg-[#050a02] text-white">
                          {c}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-[34px] h-4 w-4 text-[#7FFF00]/60 lg:top-1/2 lg:-translate-y-1/2" />
                  </div>

                  {/* Service */}
                  <div className="relative">
                    <label className="mb-1 block text-[11px] text-white/45 lg:hidden">
                      Service
                    </label>
                    <select
                      value={row.serviceId}
                      onChange={(e) => handleServiceChange(row.uid, e.target.value)}
                      className={selectBase}
                    >
                      {serviceOptions.length === 0 ? (
                        <option value="" className="bg-[#050a02] text-white/50">
                          No services available
                        </option>
                      ) : (
                        serviceOptions.map((s) => (
                          <option key={s.id} value={String(s.id)} className="bg-[#050a02] text-white">
                            #{s.id} {s.name} — ${s.rate.toFixed(4)}/1k
                          </option>
                        ))
                      )}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-[34px] h-4 w-4 text-[#7FFF00]/60 lg:top-1/2 lg:-translate-y-1/2" />
                  </div>

                  {/* Link */}
                  <div>
                    <label className="mb-1 block text-[11px] text-white/45 lg:hidden">
                      Link
                    </label>
                    <div className="flex items-center overflow-hidden rounded-xl border border-[#7FFF00]/15 bg-black/60 focus-within:border-[#7FFF00]/50">
                      <span className="flex items-center px-2.5 text-[#7FFF00]/70">
                        <Link2 className="h-3.5 w-3.5" />
                      </span>
                      <input
                        type="text"
                        value={row.link}
                        onChange={(e) =>
                          updateRow(row.uid, (r) => ({ ...r, link: e.target.value }))
                        }
                        placeholder={service?.link_hint || "https://..."}
                        className="w-full bg-transparent py-2.5 pr-3 text-[13px] text-white/90 outline-none placeholder:text-white/30"
                      />
                    </div>
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="mb-1 block text-[11px] text-white/45 lg:hidden">
                      Quantity
                    </label>
                    <input
                      type="number"
                      inputMode="numeric"
                      readOnly={isCustomComments}
                      min={service?.min_qty}
                      max={service?.max_qty}
                      value={isCustomComments ? String(commentLines.length) : row.quantity}
                      onChange={(e) =>
                        updateRow(row.uid, (r) => ({ ...r, quantity: e.target.value }))
                      }
                      placeholder={service ? `${service.min_qty}` : "Qty"}
                      className={`${inputBase} text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
                        isCustomComments ? "opacity-65" : ""
                      }`}
                    />
                  </div>

                  {/* Charge */}
                  <div className="flex items-center justify-between lg:justify-end">
                    <span className="text-[11px] text-white/45 lg:hidden">Charge</span>
                    <span className="font-mono text-[13px] font-semibold text-[#7FFF00]">
                      ${charge.toFixed(4)}
                    </span>
                  </div>

                  {/* Remove (desktop) */}
                  <div className="hidden lg:flex lg:justify-end">
                    <button
                      type="button"
                      onClick={() => removeRow(row.uid)}
                      disabled={rows.length <= 1}
                      aria-label={`Remove order ${idx + 1}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/20 text-red-400/70 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:pointer-events-none disabled:opacity-25"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Custom Comments textarea when applicable */}
                {isCustomComments && (
                  <div className="mt-3 lg:pl-[48px]">
                    <textarea
                      rows={3}
                      value={row.comments}
                      onChange={(e) =>
                        updateRow(row.uid, (r) => ({ ...r, comments: e.target.value }))
                      }
                      placeholder={"Enter custom comments (1 per line)\nGreat post!\nLove this!"}
                      className={`${inputBase} resize-y`}
                    />
                  </div>
                )}

                {/* Row Meta / Validation Footer */}
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] lg:pl-[48px]">
                  {service ? (
                    <span className="text-white/40">
                      Min: {service.min_qty.toLocaleString()} · Max:{" "}
                      {service.max_qty.toLocaleString()}
                      {service.audience ? ` · ${service.audience}` : ""}
                    </span>
                  ) : (
                    <span />
                  )}

                  {error ? (
                    <span className="flex items-center gap-1 text-red-400">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {error}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[#7FFF00]/80">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Ready
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add (+) Order Row Button */}
        <div className="border-t border-[#7FFF00]/15 bg-black/30 px-5 py-4">
          <button
            type="button"
            onClick={addRow}
            disabled={rows.length >= MAX_ROWS || submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#7FFF00]/35 bg-[#7FFF00]/[0.04] py-3 text-[13px] font-semibold text-[#7FFF00] transition-colors hover:border-[#7FFF00]/60 hover:bg-[#7FFF00]/10 disabled:pointer-events-none disabled:opacity-40"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#7FFF00] text-black">
              <Plus className="h-4 w-4" strokeWidth={2.5} />
            </span>
            Add another order
          </button>
        </div>

        {/* Footer: Total & Submit */}
        <div className="flex flex-col gap-4 border-t border-[#7FFF00]/15 p-5">
          {progress && (
            <p className="text-xs font-medium text-[#7FFF00]">{progress}</p>
          )}

          {report && (
            <div className="space-y-2 rounded-xl border border-[#7FFF00]/15 bg-black/40 p-4 text-xs">
              {report.succeeded.length > 0 && (
                <p className="flex items-center gap-1.5 font-medium text-[#7FFF00]">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  Placed {report.succeeded.length}{" "}
                  {report.succeeded.length === 1 ? "order" : "orders"} (
                  {report.succeeded.map((s) => `#${s.orderId}`).join(", ")})
                </p>
              )}
              {report.failed.map((f) => (
                <p key={f.rowNum} className="flex items-center gap-1.5 text-red-400">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  Order #{f.rowNum}: {f.error}
                </p>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#7FFF00]/15 bg-gradient-to-r from-[#7FFF00]/10 to-[#7FFF00]/[0.03] px-4 py-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[#7FFF00]/80">
                Total · {rows.length} {rows.length === 1 ? "order" : "orders"}
              </p>
              {errorCount > 0 && (
                <p className="mt-0.5 text-xs text-red-400">
                  {errorCount} {errorCount === 1 ? "order needs" : "orders need"} attention
                </p>
              )}
            </div>
            <span className="text-2xl font-bold text-[#7FFF00]">
              ${totalCharge.toFixed(4)}
            </span>
          </div>

          <div className={canSubmit ? "" : "pointer-events-none opacity-50"}>
            <ArrowFillButton
              btnText={submitting ? "Submitting..." : `Submit all ${rows.length} ${rows.length === 1 ? "order" : "orders"}`}
              href="#"
              role="button"
              onClick={(e) => {
                e.preventDefault();
                submitAll();
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
    </div>
  );
}
