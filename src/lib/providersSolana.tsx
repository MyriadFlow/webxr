"use client";

import React, { ReactNode } from "react";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { State, WagmiProvider } from "wagmi";
import { config, projectId } from "./wagmi";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { TorusWalletAdapter } from "@solana/wallet-adapter-wallets";

// Initialize React Query Client
const queryClient = new QueryClient();

if (!projectId) {
  throw new Error("Wallet Connect Project ID is not defined");
}

// Initialize Web3Modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: true, // Optional - false by default
});
const wallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
  new SolflareWalletAdapter(),
  new TorusWalletAdapter(),
];

interface AppKitProviderProps {
  children: ReactNode;
  initialState?: State;
}

export default function AppKitProvider({
  children,
  initialState,
}: AppKitProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Solana ConnectionProvider and WalletProvider */}
      <ConnectionProvider endpoint="https://api.mainnet-beta.solana.com">
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>{children}</WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </QueryClientProvider>
  );
}
