"use client";

import React, { useEffect, useState } from "react";
import { Code, Copy, Check, KeyRound } from "lucide-react";

const card = "rounded-2xl border border-[#7FFF00]/15 bg-[#050a02]";

type Param = [name: string, description: string];

type Endpoint = {
  id: string;
  title: string;
  params: Param[];
  // One or more example responses, shown in order under the parameter table
  responses: string[];
  variants?: string[]; // optional dropdown-like note, e.g. order types
};

const endpoints: Endpoint[] = [
  {
    id: "services",
    title: "Service list",
    params: [
      ["key", "Your API key"],
      ["action", "services"],
    ],
    responses: [
      `[
  {
    "service": 1,
    "name": "Followers",
    "type": "Default",
    "category": "First Category",
    "rate": "0.90",
    "min": "50",
    "max": "10000",
    "refill": true,
    "cancel": true
  },
  {
    "service": 2,
    "name": "Comments",
    "type": "Custom Comments",
    "category": "Second Category",
    "rate": "8",
    "min": "10",
    "max": "1500",
    "refill": false,
    "cancel": true
  }
]`,
    ],
  },
  {
    id: "add",
    title: "Add order",
    params: [
      ["key", "Your API key"],
      ["action", "add"],
      ["service", "Service ID"],
      ["link", "Link to page"],
      ["quantity", "Needed quantity"],
      ["runs (optional)", "Runs to deliver"],
      ["interval (optional)", "Interval in minutes"],
    ],
    responses: [
      `{
  "order": 23501
}`,
    ],
  },
  {
    id: "status",
    title: "Order status",
    params: [
      ["key", "Your API key"],
      ["action", "status"],
      ["order", "Order ID"],
    ],
    responses: [
      `{
  "charge": "0.27819",
  "start_count": "3572",
  "status": "Partial",
  "remains": "157",
  "currency": "USD"
}`,
    ],
  },
  {
    id: "multi-status",
    title: "Multiple orders status",
    params: [
      ["key", "Your API key"],
      ["action", "status"],
      ["orders", "Order IDs (separated by a comma, up to 100 IDs)"],
    ],
    responses: [
      `{
  "1": {
    "charge": "0.27819",
    "start_count": "3572",
    "status": "Partial",
    "remains": "157",
    "currency": "USD"
  },
  "10": {
    "error": "Incorrect order ID"
  },
  "100": {
    "charge": "1.44219",
    "start_count": "234",
    "status": "In progress",
    "remains": "10",
    "currency": "USD"
  }
}`,
    ],
  },
  {
    id: "refill",
    title: "Create refill",
    params: [
      ["key", "Your API key"],
      ["action", "refill"],
      ["order", "Order ID"],
    ],
    responses: [
      `{
  "refill": "1"
}`,
    ],
  },
  {
    id: "multi-refill",
    title: "Create multiple refill",
    params: [
      ["key", "Your API key"],
      ["action", "refill"],
      ["orders", "Order IDs (separated by a comma, up to 100 IDs)"],
    ],
    responses: [
      `[
  {
    "order": 1,
    "refill": 1
  },
  {
    "order": 2,
    "refill": 2
  },
  {
    "order": 3,
    "refill": {
      "error": "Incorrect order ID"
    }
  }
]`,
    ],
  },
  {
    id: "refill-status",
    title: "Get refill status",
    params: [
      ["key", "Your API key"],
      ["action", "refill_status"],
      ["refill", "Refill ID"],
    ],
    responses: [
      `{
  "status": "Completed"
}`,
    ],
  },
  {
    id: "multi-refill-status",
    title: "Get multiple refill status",
    params: [
      ["key", "Your API key"],
      ["action", "refill_status"],
      ["refills", "Refill IDs (separated by a comma, up to 100 IDs)"],
    ],
    responses: [
      `[
  {
    "refill": 1,
    "status": "Completed"
  },
  {
    "refill": 2,
    "status": "Rejected"
  },
  {
    "refill": 3,
    "status": {
      "error": "Refill not found"
    }
  }
]`,
    ],
  },
  {
    id: "cancel",
    title: "Create cancel",
    params: [
      ["key", "Your API key"],
      ["action", "cancel"],
      ["orders", "Order IDs (separated by a comma, up to 100 IDs)"],
    ],
    responses: [
      `[
  {
    "order": 9,
    "cancel": {
      "error": "Incorrect order ID"
    }
  },
  {
    "order": 2,
    "cancel": 1
  }
]`,
    ],
  },
  {
    id: "balance",
    title: "User balance",
    params: [
      ["key", "Your API key"],
      ["action", "balance"],
    ],
    responses: [
      `{
  "balance": "100.84292",
  "currency": "USD"
}`,
    ],
  },
];

/* ---------- Copy button ---------- */

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={label}
      className="shrink-0 rounded p-1.5 text-[#7FFF00]/70 outline-none transition-colors hover:bg-[#7FFF00]/10 hover:text-[#7FFF00] focus-visible:ring-1 focus-visible:ring-[#7FFF00]/60"
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </button>
  );
}

/* ---------- JSON highlighting ---------- */

// Colors keys, strings, numbers and booleans like the reference docs.
function highlight(json: string): React.ReactNode[] {
  const re = /("(?:[^"\\]|\\.)*")(\s*:)?|\b(true|false)\b|(-?\d+(?:\.\d+)?)/g;
  const out: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(json))) {
    if (m.index > last) out.push(json.slice(last, m.index));
    if (m[1] && m[2]) {
      out.push(
        <span key={i++} className="text-white/80">
          {m[1]}
        </span>,
      );
      out.push(m[2]);
    } else if (m[1]) {
      out.push(
        <span key={i++} className="text-emerald-400">
          {m[1]}
        </span>,
      );
    } else if (m[3]) {
      out.push(
        <span key={i++} className="font-semibold text-red-400">
          {m[3]}
        </span>,
      );
    } else if (m[4]) {
      out.push(
        <span key={i++} className="text-amber-400">
          {m[4]}
        </span>,
      );
    }
    last = re.lastIndex;
  }
  if (last < json.length) out.push(json.slice(last));
  return out;
}

function ResponseBlock({ json }: { json: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#7FFF00]/15 bg-black/50">
      <div className="flex items-center justify-between border-b border-[#7FFF00]/10 bg-black px-4 py-2">
        <span className="text-[12px] font-semibold text-white">Response</span>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-white/50">JSON</span>
          <CopyButton text={json} label="Copy response" />
        </div>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[12px] leading-relaxed text-white/70 [&::-webkit-scrollbar]:hidden">
        {highlight(json)}
      </pre>
    </div>
  );
}

function ParamTable({ params }: { params: Param[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#7FFF00]/15">
      <div className="grid grid-cols-[minmax(120px,1fr)_minmax(0,3fr)] bg-black px-4 py-2.5 text-[13px] font-semibold text-white">
        <span>Parameters</span>
        <span>Description</span>
      </div>
      {params.map(([name, desc]) => (
        <div
          key={name}
          className="grid grid-cols-[minmax(120px,1fr)_minmax(0,3fr)] gap-3 border-t border-[#7FFF00]/10 bg-black/30 px-4 py-3 text-[13px]"
        >
          <span className="font-mono text-white/60">{name}</span>
          <span className="text-white/90">{desc}</span>
        </div>
      ))}
    </div>
  );
}

/* ---------- Main ---------- */

export function ApiDocs({
  apiKey = "", // TODO: load the user's API key from Supabase (profiles.api_key)
  apiPath = "/api/v2",
}: {
  apiKey?: string;
  apiPath?: string;
}) {
  const [origin, setOrigin] = useState("");
  useEffect(() => setOrigin(window.location.origin), []);

  const apiUrl = `${origin}${apiPath}`;

  const meta: [string, React.ReactNode][] = [
    ["HTTP Method", "POST"],
    [
      "API URL",
      <span key="url" className="flex items-center justify-between gap-2">
        <span className="min-w-0 truncate">{apiUrl}</span>
        <CopyButton text={apiUrl} label="Copy API URL" />
      </span>,
    ],
    [
      "API Key",
      apiKey ? (
        <span key="key" className="flex items-center justify-between gap-2">
          <span className="min-w-0 truncate font-mono">{apiKey}</span>
          <CopyButton text={apiKey} label="Copy API key" />
        </span>
      ) : (
        "Your API key will appear here once your account has one."
      ),
    ],
    ["Response format", "JSON"],
  ];

  const phpSample = `<?php
$ch = curl_init("${apiUrl}");
curl_setopt_array($ch, [
  CURLOPT_POST => true,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_POSTFIELDS => http_build_query([
    "key" => "${apiKey || "YOUR_API_KEY"}",
    "action" => "balance",
  ]),
]);
echo curl_exec($ch);`;

  const [showSample, setShowSample] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-[#7FFF00]/20 bg-gradient-to-br from-[#0d2a05] via-[#071a03] to-black p-6">
        <span className="absolute left-0 top-1/2 h-14 w-[3px] -translate-y-1/2 rounded-r bg-[#7FFF00]" />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#7FFF00]/25 bg-[#7FFF00]/10">
              <Code className="h-5 w-5 text-[#7FFF00]" strokeWidth={1.5} />
            </span>
            <div>
              <h1 className="text-2xl font-bold text-white">API</h1>
              <p className="text-[13px] text-white/60">
                Place orders and track them from your own panel or scripts.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowSample((s) => !s)}
            aria-expanded={showSample}
            className="flex items-center gap-2 rounded-xl bg-[#7FFF00] px-4 py-2.5 text-[13px] font-semibold text-black outline-none transition-colors hover:bg-[#7FFF00]/85 focus-visible:ring-2 focus-visible:ring-[#7FFF00]/60"
          >
            <Code className="h-4 w-4" strokeWidth={2} />
            Example of PHP code
          </button>
        </div>

        {showSample && (
          <div className="mt-5 overflow-hidden rounded-xl border border-[#7FFF00]/15 bg-black/50">
            <div className="flex items-center justify-between border-b border-[#7FFF00]/10 bg-black px-4 py-2">
              <span className="text-[12px] font-semibold text-white">PHP</span>
              <CopyButton text={phpSample} label="Copy PHP example" />
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-[12px] leading-relaxed text-white/80 [&::-webkit-scrollbar]:hidden">
              {phpSample}
            </pre>
          </div>
        )}
      </div>

      {/* Connection details */}
      <div className={`${card} overflow-hidden`}>
        {meta.map(([label, value], i) => (
          <div
            key={label}
            className={`grid grid-cols-[minmax(120px,1fr)_minmax(0,3fr)] items-center gap-3 px-5 py-3.5 text-[13px] ${
              i > 0 ? "border-t border-[#7FFF00]/10" : ""
            }`}
          >
            <span className="flex items-center gap-2 text-white/60">
              {label === "API Key" && (
                <KeyRound className="h-3.5 w-3.5 text-[#7FFF00]" strokeWidth={1.75} />
              )}
              {label}
            </span>
            <span className="min-w-0 text-white/90">{value}</span>
          </div>
        ))}
      </div>

      {/* Endpoints */}
      {endpoints.map((e) => (
        <section key={e.id} id={`api-${e.id}`} className={`${card} p-5 md:p-6`}>
          <h2 className="mb-4 text-lg font-semibold text-white">{e.title}</h2>
          <ParamTable params={e.params} />
          <p className="mb-3 mt-6 text-[13px] font-medium text-white">Example response</p>
          <div className="flex flex-col gap-4">
            {e.responses.map((r, i) => (
              <ResponseBlock key={i} json={r} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
