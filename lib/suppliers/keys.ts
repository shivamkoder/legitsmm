const KEYS: Record<string, string> = {
  NICESMM_API_KEY: "your_real_nicesmm_key",
  MORETHANPANEL_API_KEY: "your_real_morethanpanel_key",
};

export function resolveSupplierKey(envName: string): string | null {
  return KEYS[envName] ?? null;
}
