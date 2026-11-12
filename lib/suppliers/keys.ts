const KEYS: Record<string, string> = {
  
  MORETHANPANEL_API_KEY: "fb2a1b8c135c2c4224f930c63ca5a2f8",
};

export function resolveSupplierKey(envName: string): string | null {
  return KEYS[envName] ?? null;
}
