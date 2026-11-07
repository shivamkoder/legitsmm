import { createAdminClient } from "@/lib/supabase/admin";
import { resolveSupplierKey } from "@/lib/suppliers/keys";

export type Supplier = {
  id: number;
  slug: string;
  name: string;
  api_url: string;
  api_key_env: string;
};

/**
 * not_sent : nothing left our server (e.g. missing API key). Safe to reroute.
 * rejected : the supplier answered with an error. Safe to reroute.
 * unknown  : timeout, network error, 5xx or garbage reply. The supplier MAY have
 *            accepted the order, so do NOT reroute; check status first.
 */
export type SupplierErrorKind = "not_sent" | "rejected" | "unknown";

export class SupplierError extends Error {
  kind: SupplierErrorKind;
  constructor(message: string, kind: SupplierErrorKind) {
    super(message);
    this.name = "SupplierError";
    this.kind = kind;
  }
}

export type SupplierStatus =
  | { ok: true; status: string; startCount: number | null; remains: number | null }
  | { ok: false; error: string };

export type SupplierService = {
  service: string;
  name: string;
  category: string;
  type: string;
  rate: number;
  min: number;
  max: number;
  refill: boolean;
  cancel: boolean;
};

const TIMEOUT_MS = 15_000;

/** Loads a supplier row. Not filtered by is_active: we must keep polling open orders of a disabled supplier. */
export async function getSupplier(id: number): Promise<Supplier> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("suppliers")
    .select("id, slug, name, api_url, api_key_env")
    .eq("id", id)
    .single();
  if (error || !data) {
    throw new SupplierError(`Supplier ${id} not found`, "not_sent");
  }
  return data as Supplier;
}

/**
 * The one place a supplier API key is used. Every call (add, status,
 * services, balance) goes through here as a form-encoded POST: key=...&action=...
 */
async function call(
  supplier: Supplier,
  params: Record<string, string>,
  timeoutMs: number = TIMEOUT_MS,
): Promise<unknown> {
  const key = resolveSupplierKey(supplier.api_key_env);
  if (!key) {
    throw new SupplierError(
      `${supplier.name}: no API key found for "${supplier.api_key_env}"`,
      "not_sent",
    );
  }

  let res: Response;
  try {
    res = await fetch(supplier.api_url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ key, ...params }),
      signal: AbortSignal.timeout(timeoutMs),
      cache: "no-store",
    });
  } catch {
    throw new SupplierError(`${supplier.name}: request failed or timed out`, "unknown");
  }

  if (!res.ok) {
    throw new SupplierError(`${supplier.name}: HTTP ${res.status}`, "unknown");
  }
  try {
    return await res.json();
  } catch {
    throw new SupplierError(`${supplier.name}: invalid JSON reply`, "unknown");
  }
}

/** Supplier wallet balance. Handy to confirm the key and URL work. */
export async function getBalance(
  supplier: Supplier,
): Promise<{ balance: string; currency: string }> {
  const json = (await call(supplier, { action: "balance" })) as {
    balance?: unknown;
    currency?: unknown;
    error?: unknown;
  } | null;
  if (json && json.error) {
    throw new SupplierError(String(json.error), "rejected");
  }
  if (!json || json.balance === undefined || json.balance === null) {
    throw new SupplierError(`${supplier.name}: unexpected balance response`, "unknown");
  }
  return { balance: String(json.balance), currency: String(json.currency ?? "USD") };
}

/** Sends an order. Returns the supplier's order id. */
export async function addOrder(
  supplier: Supplier,
  input: {
    serviceId: string;
    link: string;
    quantity: number;
    extra?: Record<string, unknown>;
  },
): Promise<string> {
  const params: Record<string, string> = {
    action: "add",
    service: input.serviceId,
    link: input.link,
  };

  const comments = input.extra?.comments;
  if (typeof comments === "string" && comments.trim()) {
    // Custom-comment services take the comment lines instead of a quantity.
    params.comments = comments;
  } else {
    params.quantity = String(input.quantity);
  }
  // geo_targeted services need no extra param: the target country is already
  // baked into the mapped supplier service id.

  const json = (await call(supplier, params)) as { order?: number | string; error?: unknown } | null;
  if (json && json.error) {
    throw new SupplierError(String(json.error), "rejected");
  }
  if (!json || json.order === undefined || json.order === null) {
    throw new SupplierError(`${supplier.name}: unexpected add response`, "unknown");
  }
  return String(json.order);
}

const toInt = (v: unknown): number | null => {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : null;
};

function parseStatus(raw: unknown): SupplierStatus {
  if (!raw || typeof raw !== "object") return { ok: false, error: "Malformed status" };
  const r = raw as Record<string, unknown>;
  if (r.error) return { ok: false, error: String(r.error) };
  if (typeof r.status !== "string") return { ok: false, error: "Missing status" };
  return {
    ok: true,
    status: r.status,
    startCount: toInt(r.start_count),
    remains: toInt(r.remains),
  };
}

/**
 * Status for up to 100 supplier order ids in ONE request.
 * Returns a map keyed by supplier order id. A failed individual order comes
 * back as { ok: false }; a failed whole request throws a SupplierError.
 */
export async function getStatuses(
  supplier: Supplier,
  ids: string[],
): Promise<Record<string, SupplierStatus>> {
  if (ids.length === 0) return {};
  if (ids.length > 100) throw new Error("getStatuses accepts at most 100 ids");

  const json = await call(supplier, { action: "status", orders: ids.join(",") });
  if (!json || typeof json !== "object") {
    throw new SupplierError(`${supplier.name}: malformed status response`, "unknown");
  }
  const obj = json as Record<string, unknown>;

  // Whole-request error such as {"error":"Incorrect API key"}
  if (typeof obj.error === "string") {
    throw new SupplierError(obj.error, "rejected");
  }

  const out: Record<string, SupplierStatus> = {};
  // Some panels answer a single id with a flat object instead of keying it.
  if (ids.length === 1 && "status" in obj) {
    out[ids[0]] = parseStatus(obj);
    return out;
  }
  for (const id of ids) out[id] = parseStatus(obj[id]);
  return out;
}

/** Full wholesale catalog, for the sync job. Big catalogs can be slow, so give it 50s. */
export async function getServices(supplier: Supplier): Promise<SupplierService[]> {
  const json = await call(supplier, { action: "services" }, 50_000);
  if (!Array.isArray(json)) {
    const msg =
      json && typeof json === "object" && "error" in json
        ? String((json as { error: unknown }).error)
        : "malformed services response";
    throw new SupplierError(`${supplier.name}: ${msg}`, "unknown");
  }
  return json.map((s: Record<string, unknown>) => ({
    service: String(s.service),
    name: String(s.name ?? ""),
    category: String(s.category ?? ""),
    type: String(s.type ?? "Default"),
    rate: Number(s.rate),
    min: Number(s.min),
    max: Number(s.max),
    refill: Boolean(s.refill),
    cancel: Boolean(s.cancel),
  }));
}
