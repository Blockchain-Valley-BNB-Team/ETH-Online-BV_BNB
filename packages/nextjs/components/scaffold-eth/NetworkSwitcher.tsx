"use client";

import { Button } from "@/components/ui/button";
import { Network } from "lucide-react";
import { useAccount, useSwitchChain } from "wagmi";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { getTargetNetworks } from "~~/utils/scaffold-eth/networks";

/**
 * 네트워크 전환 버튼 컴포넌트
 */
export const NetworkSwitcher = () => {
  const { chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const { targetNetwork } = useTargetNetwork();
  const availableNetworks = getTargetNetworks();

  // 현재 연결된 네트워크 표시
  const currentChain = chain || targetNetwork;

  return (
    <div className="relative group">
      <Button
        variant="outline"
        size="sm"
        className="border-white/20 text-foreground hover:bg-white/10 bg-transparent gap-2"
      >
        <Network className="h-4 w-4" />
        <span className="hidden md:inline">{currentChain.name}</span>
      </Button>

      {/* Dropdown Menu */}
      <div className="absolute right-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
        <div className="bg-card border border-white/10 rounded-lg shadow-lg p-2 space-y-1">
          <div className="px-3 py-2 text-xs font-bold text-muted-foreground">Network</div>
          {availableNetworks.map(network => {
            const isCurrentNetwork = currentChain.id === network.id;
            return (
              <button
                key={network.id}
                onClick={() => {
                  if (!isCurrentNetwork && switchChain) {
                    switchChain({ chainId: network.id });
                  }
                }}
                disabled={isCurrentNetwork}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  isCurrentNetwork
                    ? "bg-accent/20 text-accent font-semibold cursor-default"
                    : "hover:bg-white/5 text-foreground"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{network.name}</span>
                  {isCurrentNetwork && <span className="text-xs text-accent">✓</span>}
                </div>
                {network.id === network.id && (
                  <div className="text-xs text-muted-foreground mt-0.5">Chain ID: {network.id}</div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
