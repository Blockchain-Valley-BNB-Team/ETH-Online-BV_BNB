"use client";

import { useEffect, useState } from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import { useWallets } from "@privy-io/react-auth";
import { WagmiProvider, useSetActiveWallet } from "@privy-io/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { useTheme } from "next-themes";
import { Toaster } from "react-hot-toast";
import { baseSepolia, foundry } from "viem/chains";
import { useAccount } from "wagmi";
import { useInitializeNativeCurrencyPrice } from "~~/hooks/scaffold-eth";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  useInitializeNativeCurrencyPrice();

  return (
    <>
      <div className={`flex flex-col min-h-screen `}>
        <main className="relative flex flex-col flex-1">{children}</main>
      </div>
      <Toaster />
    </>
  );
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * Privy ↔ wagmi 활성 지갑 동기화 브리지
 */
const PrivyWagmiBridge = () => {
  const { wallets } = useWallets();
  const { setActiveWallet } = useSetActiveWallet();
  const { address } = useAccount();

  useEffect(() => {
    const embedded = wallets.find(w => (w as any).walletClientType?.startsWith("privy"));
    if (!embedded) return;
    if (!address || address.toLowerCase() !== embedded.address.toLowerCase()) {
      setActiveWallet(embedded as any).catch(() => void 0);
    }
  }, [wallets, address, setActiveWallet]);

  return null;
};

export const ScaffoldEthAppWithProviders = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
      config={{
        loginMethods: ["email", "wallet", "google", "twitter"],
        appearance: {
          theme: mounted ? (isDarkMode ? "dark" : "light") : "light",
          accentColor: "#2299dd",
        },
        supportedChains: [baseSepolia, foundry],
        defaultChain: baseSepolia,
        embeddedWallets: {
          ethereum: {
            // 로그인 시 (아직 지갑이 없는) 사용자에게 Privy 내장 지갑 생성 유도
            createOnLogin: "users-without-wallets",
          },
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          <ProgressBar height="3px" color="#2299dd" />
          <PrivyWagmiBridge />
          <ScaffoldEthApp>{children}</ScaffoldEthApp>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
};
