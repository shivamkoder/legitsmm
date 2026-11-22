const KEYS: Record<string, string> = {
  
  MORETHANPANEL_API_KEY: "fb2a1b8c135c2c4224f930c63ca5a2f8",
};

export function resolveSupplierKey(envName: string): string | null {
  const envVal = typeof process !== "undefined" && process.env ? process.env[envName] : undefined;
  if (envVal && envVal.trim()) return envVal.trim();
  const staticVal = KEYS[envName];
  if (staticVal && staticVal.trim()) return staticVal.trim();
  return null;
}
