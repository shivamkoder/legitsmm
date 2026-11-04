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
};

// Supabase returns at most 1000 rows per request, so page through.
export async function fetchServices(): Promise<DbService[]> {
  const supabase = createClient();
  const all: DbService[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase
      .from("services")
      .select("id, platform, category, name, type, rate, min_qty, max_qty, refill")
      .eq("is_active", true)
      .order("category")
      .order("rate")
      .range(from, from + 999);
    if (error) throw new Error(error.message);
    all.push(...(data as DbService[]));
    if (!data || data.length < 1000) break;
  }
  return all;
}
