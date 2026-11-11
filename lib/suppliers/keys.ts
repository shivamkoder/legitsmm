const KEYS: Record<string, string> = {
  NICESMM_API_KEY: "27c8e671cec6ca78b7c5fd14f08a70e9",
  MORETHANPANEL_API_KEY: "fb2a1b8c135c2c4224f930c63ca5a2f8",
};

export function resolveSupplierKey(envName: string): string | null {
  return KEYS[envName] ?? null;
}
