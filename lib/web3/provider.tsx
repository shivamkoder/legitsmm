"use client";

import type { ReactNode } from "react";
import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { polygon, bsc, type AppKitNetwork } from "@reown/appkit/networks";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Get a free project id at https://cloud.reown.com
const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID ?? "";
export const web3Ready = projectId !== "";

const networks: [AppKitNetwork, ...AppKitNetwork[]] = [polygon, bsc];

export const wagmiAdapter = new WagmiAdapter({
  projectId: projectId || "missing",
  networks,
  ssr: true,
});

if (web3Ready) {
  createAppKit({
    adapters: [wagmiAdapter],
    projectId,
    networks,
    defaultNetwork: polygon,
    metadata: {
      name: "Legit SMM",
      description: "Add funds with your crypto wallet",
      // Must match the domain you registered in Reown Cloud.
      url: process.env.NEXT_PUBLIC_SITE_URL ?? (typeof window !== "undefined" ? window.location.origin : ""),
      icons: ["/legit-logo.png"],
    },
    features: { analytics: false, email: false, socials: false },
    themeMode: "dark",
    themeVariables: { "--w3m-accent": "#7FFF00" },
  });
}

const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
