"use client";

import Link from "next/link";
import { NetworkSwitcher } from "@/components/scaffold-eth/NetworkSwitcher";
import { Button } from "@/components/ui/button";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { ChevronDown } from "lucide-react";
import { Address } from "viem";
import { useAccount } from "wagmi";

export function Navigation() {
  const { ready, authenticated, login, logout, user } = usePrivy();
  const { wallets } = useWallets();
  const { address: wagmiAddress } = useAccount();

  // 주소 우선순위: Privy 지갑 > wagmi의 외부 지갑
  const privyAddress = wallets[0]?.address as Address | undefined;
  const address = privyAddress || wagmiAddress;

  const renderWalletButton = () => {
    // Privy가 준비되지 않았을 때
    if (!ready) {
      return (
        <Button variant="outline" size="sm" disabled className="border-accent/50 text-accent/50 bg-transparent">
          Loading...
        </Button>
      );
    }

    // 로그인되지 않았을 때
    if (!authenticated || !address) {
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={login}
          className="border-accent text-accent hover:bg-accent hover:text-background bg-transparent"
        >
          Connect Wallet
        </Button>
      );
    }

    // 연결되었을 때
    return (
      <div className="relative group">
        <Button
          variant="outline"
          size="sm"
          className="border-accent text-accent hover:bg-accent hover:text-background bg-transparent gap-2"
        >
          <span className="truncate max-w-[120px]">
            {user?.email?.address ||
              user?.google?.email ||
              user?.twitter?.username ||
              `${address.slice(0, 6)}...${address.slice(-4)}`}
          </span>
          <ChevronDown className="h-3 w-3" />
        </Button>

        {/* Dropdown Menu */}
        <div className="absolute right-0 mt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
          <div className="bg-card border border-white/10 rounded-lg shadow-lg p-2 space-y-2">
            <div className="px-3 py-2 text-xs">
              <div className="font-bold text-muted-foreground">Address:</div>
              <div className="break-all text-foreground mt-1">{address}</div>
            </div>
            {user?.email?.address && (
              <div className="px-3 py-2 text-xs">
                <div className="font-bold text-muted-foreground">Email:</div>
                <div className="text-foreground mt-1">{user.email.address}</div>
              </div>
            )}
            <div className="border-t border-white/10 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                Disconnect
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 h-16">
        {/* 3개 컬럼 그리드 레이아웃: 왼쪽(로고), 중앙(메뉴), 오른쪽(버튼들) */}
        <div className="grid grid-cols-3 items-center h-full">
          {/* 왼쪽: 로고 */}
          <div className="flex justify-start">
            <Link href="/" className="text-2xl font-bold text-accent">
              Biomni
            </Link>
          </div>

          {/* 중앙: 네비게이션 메뉴 */}
          <div className="hidden md:flex items-center justify-center gap-8">
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link
              href="/research-pool"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Research Pool
            </Link>
            <Link href="/tools" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Tools
            </Link>
            <Link href="/profile" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Profile
            </Link>
          </div>

          {/* 오른쪽: 네트워크 스위처 + 지갑 버튼 */}
          <div className="flex items-center justify-end gap-3">
            <NetworkSwitcher />
            {renderWalletButton()}
          </div>
        </div>
      </div>
    </nav>
  );
}
