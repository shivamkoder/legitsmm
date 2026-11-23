"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type DbService = {
  id: number;
  platform: string;
  category: string;
  name: string;
  type: string;
  rate: number;
  min_qty: number;
  max_qty: number;
  refill: boolean;
  refill_days?: number | null;
  audience?: string | null;
  start_time?: string | null;
  speed?: string | null;
  link_hint?: string | null;
};

// Supabase returns at most 1000 rows per request, so page through.
export async function fetchServices(): Promise<DbService[]> {
  const supabase = createClient();
  const all: DbService[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase
      .from("services")
      .select("id, platform, category, name, type, rate, min_qty, max_qty, refill, refill_days, audience, start_time, speed, link_hint")
      .eq("is_active", true)
      .order("id")
      .range(from, from + 999);
    if (error) throw new Error(error.message);
    const mapped = (data ?? []).map((s: any) => ({
      ...s,
      rate: Number(s.rate) || 0,
      min_qty: Number(s.min_qty ?? 1),
      max_qty: Number(s.max_qty ?? 1000000),
      audience: s.audience || null,
    }));
    all.push(...mapped);
    if (!data || data.length < 1000) break;
  }
  return all;
}

export function useServices() {
  const [services, setServices] = useState<DbService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServices()
      .then(setServices)
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, []);

  return { services, loading, error };
}
