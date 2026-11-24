"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Code,
  KeyRound,
  Copy,
  Check,
  RefreshCw,
  Trash2,
  ShieldAlert,
  Terminal,
  Globe,
} from "lucide-react";

const card = "rounded-2xl border border-[#7FFF00]/15 bg-[#050a02]";

type EndpointId = "services" | "add" | "status" | "multi-status" | "balance";
type Lang = "curl" | "node" | "python";

type ParamRow = {
  name: string;
  required: boolean;
  description: string;
};

type EndpointDoc = {
  id: EndpointId;
  label: string;
  action: string;
  summary: string;
  params: ParamRow[];
  sampleBody: Record<string, string>;
  sampleResponse: string;
};

const ENDPOINTS: EndpointDoc[] = [
  {
    id: "services",
    label: "Service List",
    action: "services",
    summary: "Fetch all active services across all 13 platforms with live retail rates and min/max limits.",
    params: [
      { name: "key", required: true, description: "Your LegitSMM API key" },
      { name: "action", required: true, description: 'Must be "services"' },
    ],
    sampleBody: { key: "YOUR_API_KEY", action: "services" },
    sampleResponse: JSON.stringify(
      [
        {
          service: 9052,
          name: "Instagram Organic Views (30-day refill)",
          type: "Default",
          category: "Instagram - Views",
          rate: "0.0242",
          min: "100",
          max: "500000000",
          refill: true,
          cancel: true,
        },
        {
          service: 9033,
          name: "Instagram Organic Likes (Drip-feed)",
          type: "Default",
          category: "Instagram - Likes",
          rate: "0.2662",
          min: "10",
          max: "1000000",
          refill: false,
          cancel: false,
        },
      ],
      null,
      2,
    ),
  },
  {
    id: "add",
    label: "Add Order",
    action: "add",
    summary: "Place a new order. Balance is checked and deducted atomically; failed orders are refunded instantly.",
    params: [
      { name: "key", required: true, description: "Your LegitSMM API key" },
      { name: "action", required: true, description: 'Must be "add"' },
      { name: "service", required: true, description: "Service ID (from action=services)" },
      { name: "link", required: true, description: "Target profile, post, or video URL" },
      { name: "quantity", required: true, description: "Order quantity within service min/max (auto-computed for custom comments)" },
      { name: "comments", required: false, description: "Newline-separated comments (only for Custom Comments services)" },
    ],
    sampleBody: {
      key: "YOUR_API_KEY",
      action: "add",
      service: "9052",
      link: "https://www.instagram.com/p/EXAMPLE/",
      quantity: "1000",
    },
    sampleResponse: JSON.stringify({ order: 1042 }, null, 2),
  },
  {
    id: "status",
    label: "Order Status",
    action: "status",
    summary: "Check the live fulfillment status, start count, charge, and remaining quantity for a single order.",
    params: [
      { name: "key", required: true, description: "Your LegitSMM API key" },
      { name: "action", required: true, description: 'Must be "status"' },
      { name: "order", required: true, description: "Your Order ID returned by action=add" },
    ],
    sampleBody: { key: "YOUR_API_KEY", action: "status", order: "1042" },
    sampleResponse: JSON.stringify(
      {
        charge: "0.0242",
        start_count: "1250",
        status: "Completed",
        remains: "0",
        currency: "USD",
      },
      null,
      2,
    ),
  },
  {
    id: "multi-status",
    label: "Multiple Status",
    action: "status",
    summary: "Check up to 100 order IDs in a single request using a comma-separated list.",
    params: [
      { name: "key", required: true, description: "Your LegitSMM API key" },
      { name: "action", required: true, description: 'Must be "status"' },
      { name: "orders", required: true, description: "Comma-separated Order IDs (max 100, e.g. 1042,1043,1044)" },
    ],
    sampleBody: { key: "YOUR_API_KEY", action: "status", orders: "1042,1043" },
    sampleResponse: JSON.stringify(
      {
        "1042": {
          charge: "0.0242",
          start_count: "1250",
          status: "Completed",
          remains: "0",
          currency: "USD",
        },
        "1043": {
          charge: "0.2662",
          start_count: "84",
          status: "In progress",
          remains: "250",
          currency: "USD",
        },
      },
      null,
      2,
    ),
  },
  {
    id: "balance",
    label: "User Balance",
    action: "balance",
    summary: "Retrieve your current account balance and currency.",
    params: [
      { name: "key", required: true, description: "Your LegitSMM API key" },
      { name: "action", required: true, description: 'Must be "balance"' },
    ],
    sampleBody: { key: "YOUR_API_KEY", action: "balance" },
    sampleResponse: JSON.stringify({ balance: "25.4500", currency: "USD" }, null, 2),
  },
];

function buildSnippet(lang: Lang, url: string, body: Record<string, string>): string {
  if (lang === "curl") {
    const flags = Object.entries(body)
      .map(([k, v]) => `  -d "${k}=${v}"`)
      .join(" \\\n");
    return `curl -X POST "${url}" \\\n${flags}`;
  }
  if (lang === "node") {
    return `const res = await fetch("${url}", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(${JSON.stringify(body, null, 2)}),
});
const data = await res.json();
console.log(data);`;
  }
  return `import requests

res = requests.post(
    "${url}",
    data=${JSON.stringify(body, null, 4)},
    timeout=30,
)
print(res.json())`;
}

export function ApiPage() {
  const [origin, setOrigin] = useState("https://your-domain.com");
  const [hasKey, setHasKey] = useState(false);
  const [prefix, setPrefix] = useState<string | null>(null);
  const [freshKey, setFreshKey] = useState<string | null>(null);
  const [loadingKey, setLoadingKey] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<EndpointId>("services");
  const [lang, setLang] = useState<Lang>("curl");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
    fetch("/api/account/api-key")
      .then((r) => r.json())
      .then((d) => {
        setHasKey(Boolean(d.hasKey));
        setPrefix(d.prefix ?? null);
      })
      .catch(() => setError("Could not load API key status."))
      .finally(() => setLoadingKey(false));
  }, []);

  const endpointUrl = `${origin}/api/v2`;

  const copyText = async (id: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedId(id);
      setTimeout(() => setCopiedId((curr) => (curr === id ? null : curr)), 1800);
    } catch {
      // Clipboard API unavailable
    }
  };

  const handleGenerate = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/account/api-key", { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to generate key.");
      setFreshKey(json.apiKey);
      setPrefix(json.prefix);
      setHasKey(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate key.");
    } finally {
      setBusy(false);
    }
  };

  const handleRevoke = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/account/api-key", { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to revoke key.");
      setFreshKey(null);
      setPrefix(null);
      setHasKey(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to revoke key.");
    } finally {
      setBusy(false);
    }
  };

  const currentDoc = useMemo(
    () => ENDPOINTS.find((e) => e.id === activeTab) ?? ENDPOINTS[0],
    [activeTab],
  );

  const snippetBody = useMemo(() => {
    return {
      ...currentDoc.sampleBody,
      key: freshKey ?? "YOUR_API_KEY",
    };
  }, [currentDoc, freshKey]);

  const codeSnippet = useMemo(
    () => buildSnippet(lang, endpointUrl, snippetBody),
    [lang, endpointUrl, snippetBody],
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header & Overview */}
      <div className={`${card} overflow-hidden`}>
        <div className="relative flex flex-wrap items-center justify-between gap-4 border-b border-[#7FFF00]/15 px-5 py-4">
          <span className="absolute left-0 top-1/2 h-7 w-[3px] -translate-y-1/2 rounded-r bg-[#7FFF00]" />
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#7FFF00]/25 bg-[#7FFF00]/10">
              <Code className="h-5 w-5 text-[#7FFF00]" strokeWidth={1.5} />
            </span>
            <div>
              <h2 className="text-[15px] font-semibold text-white">Developer & Reseller API</h2>
              <p className="text-[12px] text-white/50">
                Standard SMM Panel v2 compatible JSON API for automated ordering and child panels
              </p>
            </div>
          </div>
          <span className="rounded-full border border-[#7FFF00]/25 bg-[#7FFF00]/10 px-3 py-1 text-[11px] font-semibold text-[#7FFF00]">
            SMM v2 Compatible
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-3">
          <div className="rounded-xl border border-[#7FFF00]/15 bg-black/50 p-4">
            <p className="text-[11px] uppercase tracking-wider text-white/45">API Endpoint</p>
            <div className="mt-1.5 flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 truncate font-mono text-[13px] text-[#7FFF00]">
                <Globe className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{endpointUrl}</span>
              </span>
              <button
                type="button"
                onClick={() => copyText("url", endpointUrl)}
                className="shrink-0 rounded-lg border border-[#7FFF00]/20 p-1.5 text-[#7FFF00] hover:bg-[#7FFF00]/10"
                title="Copy endpoint URL"
              >
                {copiedId === "url" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-[#7FFF00]/15 bg-black/50 p-4">
            <p className="text-[11px] uppercase tracking-wider text-white/45">HTTP Method</p>
            <p className="mt-1.5 font-mono text-[14px] font-semibold text-white">
              POST <span className="text-xs font-normal text-white/45">(Form or JSON)</span>
            </p>
          </div>

          <div className="rounded-xl border border-[#7FFF00]/15 bg-black/50 p-4">
            <p className="text-[11px] uppercase tracking-wider text-white/45">Response Format</p>
            <p className="mt-1.5 font-mono text-[14px] font-semibold text-white">
              application/json
            </p>
          </div>
        </div>
      </div>

      {/* API Key Manager */}
      <div className={`${card} p-5`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#7FFF00]/25 bg-[#7FFF00]/10">
              <KeyRound className="h-5 w-5 text-[#7FFF00]" strokeWidth={1.5} />
            </span>
            <div>
              <h3 className="text-[14px] font-semibold text-white">Your API Key</h3>
              <p className="text-[12px] text-white/50">
                Keep your key secret. Only a SHA-256 hash is stored on our servers.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              disabled={busy || loadingKey}
              onClick={handleGenerate}
              className="flex items-center gap-2 rounded-xl bg-[#7FFF00] px-4 py-2.5 text-[13px] font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${busy ? "animate-spin" : ""}`} />
              {hasKey ? "Regenerate Key" : "Generate API Key"}
            </button>

            {hasKey && (
              <button
                type="button"
                disabled={busy}
                onClick={handleRevoke}
                className="flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-[13px] font-medium text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                Revoke
              </button>
            )}
          </div>
        </div>

        {error && <p className="mt-3 text-xs text-red-400">{error}</p>}

        {freshKey ? (
          <div className="mt-4 rounded-xl border border-[#7FFF00]/40 bg-[#7FFF00]/[0.07] p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#7FFF00]">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              Copy your API key now — for security, it will not be shown again.
            </div>
            <div className="mt-2.5 flex items-center justify-between gap-3 rounded-lg border border-[#7FFF00]/25 bg-black/70 px-3.5 py-2.5">
              <code className="truncate font-mono text-[13px] text-white">{freshKey}</code>
              <button
                type="button"
                onClick={() => copyText("key", freshKey)}
                className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[#7FFF00]/15 px-3 py-1.5 text-xs font-semibold text-[#7FFF00] hover:bg-[#7FFF00]/25"
              >
                {copiedId === "key" ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 flex items-center justify-between rounded-xl border border-[#7FFF00]/15 bg-black/50 px-4 py-3 text-[13px]">
            {loadingKey ? (
              <span className="text-white/45">Checking API key status...</span>
            ) : hasKey && prefix ? (
              <>
                <span className="font-mono text-white/80">
                  {prefix}••••••••••••••••••••••••••••••••••••••••
                </span>
                <span className="rounded-full bg-[#7FFF00]/15 px-2.5 py-0.5 text-[11px] font-semibold text-[#7FFF00]">
                  Active
                </span>
              </>
            ) : (
              <span className="text-white/45">
                No API key generated yet. Click &ldquo;Generate API Key&rdquo; to get started.
              </span>
            )}
          </div>
        )}
      </div>

      {/* Interactive Endpoint Documentation */}
      <div className={`${card} overflow-hidden`}>
        <div className="flex flex-wrap items-center gap-2 border-b border-[#7FFF00]/15 px-5 py-3.5">
          {ENDPOINTS.map((ep) => {
            const active = ep.id === activeTab;
            return (
              <button
                key={ep.id}
                type="button"
                onClick={() => setActiveTab(ep.id)}
                className={`rounded-xl border px-3.5 py-2 text-[12px] font-semibold transition-colors ${
                  active
                    ? "border-[#7FFF00]/50 bg-[#7FFF00]/15 text-[#7FFF00]"
                    : "border-[#7FFF00]/10 bg-black/40 text-white/65 hover:border-[#7FFF00]/30 hover:text-white"
                }`}
              >
                {ep.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-6 p-5 xl:grid-cols-2">
          {/* Left: Description & Parameters */}
          <div className="flex flex-col gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-[#7FFF00]/15 px-2 py-0.5 font-mono text-[11px] font-bold text-[#7FFF00]">
                  POST
                </span>
                <h3 className="text-[15px] font-semibold text-white">{currentDoc.label}</h3>
                <code className="rounded-md bg-white/5 px-2 py-0.5 font-mono text-[11px] text-white/60">
                  action={currentDoc.action}
                </code>
              </div>
              <p className="mt-1.5 text-[13px] text-white/60">{currentDoc.summary}</p>
            </div>

            <div className="overflow-hidden rounded-xl border border-[#7FFF00]/15 bg-black/40">
              <div className="grid grid-cols-[110px_80px_1fr] border-b border-[#7FFF00]/10 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-white/45">
                <span>Parameter</span>
                <span>Required</span>
                <span>Description</span>
              </div>
              <div className="divide-y divide-[#7FFF00]/10 text-[12px]">
                {currentDoc.params.map((p) => (
                  <div
                    key={p.name}
                    className="grid grid-cols-[110px_80px_1fr] items-start gap-2 px-4 py-2.5"
                  >
                    <code className="font-mono font-semibold text-[#7FFF00]">{p.name}</code>
                    <span className={p.required ? "text-amber-400" : "text-white/40"}>
                      {p.required ? "Yes" : "Optional"}
                    </span>
                    <span className="text-white/75">{p.description}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Code Snippet & Sample Response */}
          <div className="flex flex-col gap-4">
            <div className="overflow-hidden rounded-xl border border-[#7FFF00]/15 bg-black/60">
              <div className="flex items-center justify-between border-b border-[#7FFF00]/10 px-4 py-2.5">
                <div className="flex items-center gap-1.5">
                  <Terminal className="mr-1 h-3.5 w-3.5 text-[#7FFF00]" />
                  {(["curl", "node", "python"] as Lang[]).map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setLang(l)}
                      className={`rounded-md px-2.5 py-1 text-[11px] font-semibold uppercase transition-colors ${
                        lang === l
                          ? "bg-[#7FFF00]/20 text-[#7FFF00]"
                          : "text-white/50 hover:text-white"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => copyText("snippet", codeSnippet)}
                  className="flex items-center gap-1 rounded-md border border-[#7FFF00]/20 px-2.5 py-1 text-[11px] font-semibold text-[#7FFF00] hover:bg-[#7FFF00]/10"
                >
                  {copiedId === "snippet" ? (
                    <>
                      <Check className="h-3 w-3" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-[12px] leading-relaxed text-white/85">
                {codeSnippet}
              </pre>
            </div>

            <div className="overflow-hidden rounded-xl border border-[#7FFF00]/15 bg-black/60">
              <div className="border-b border-[#7FFF00]/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-white/45">
                Example JSON Response
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-[12px] leading-relaxed text-[#7FFF00]/90">
                {currentDoc.sampleResponse}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
