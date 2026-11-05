import { polygon, bsc } from "viem/chains";
import type { Address } from "viem";

export type ChainKey = "polygon" | "bsc";

export type TokenCfg = { symbol: "USDT" | "USDC"; address: Address; decimals: number };

export type ChainCfg = {
  id: 137 | 56;
  label: string;
  confirmations: number; // blocks to wait before crediting (reorg safety)
  tokens: TokenCfg[];
};

// IMPORTANT: verify every address below against Tether's and Circle's official
// docs before going live. Decimals differ per chain (BSC stablecoins use 18).
export const WEB3_CHAINS: Record<ChainKey, ChainCfg> = {
  polygon: {
    id: polygon.id,
    label: "Polygon",
    confirmations: 30,
    tokens: [
      { symbol: "USDT", address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", decimals: 6 },
      { symbol: "USDC", address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359", decimals: 6 },
    ],
  },
  bsc: {
    id: bsc.id,
    label: "BNB Smart Chain",
    confirmations: 15,
    tokens: [
      { symbol: "USDT", address: "0x55d398326f99059fF775485246999027B3197955", decimals: 18 },
      { symbol: "USDC", address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d", decimals: 18 },
    ],
  },
};

export const CHAIN_KEYS = Object.keys(WEB3_CHAINS) as ChainKey[];
