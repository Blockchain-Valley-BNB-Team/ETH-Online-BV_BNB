"use client";

import { Balance } from "./Balance";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { Address } from "viem";
import { useAccount, useSwitchChain } from "wagmi";
import { useNetworkColor } from "~~/hooks/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";

/**
 * Privy 기반 커스텀 Connect Button
 */
export const PrivyConnectButton = () => {
  const { ready, authenticated, login, logout, user } = usePrivy();
  const { wallets } = useWallets();
  const { address: wagmiAddress, chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const networkColor = useNetworkColor();
  const { targetNetwork } = useTargetNetwork();

  // 주소 우선순위: Privy 지갑 > wagmi의 외부 지갑(예: MetaMask)
  const privyAddress = wallets[0]?.address as Address | undefined;
  const address = privyAddress || wagmiAddress;

  console.log("PrivyConnectButton render:", {
    ready,
    authenticated,
    address,
    wallets: wallets.length,
    user: user?.email?.address || user?.google?.email || user?.twitter?.username,
  });

  // Privy가 준비되지 않았을 때
  if (!ready) {
    return (
      <button className="btn btn-primary btn-sm" disabled>
        Loading...
      </button>
    );
  }

  // 로그인되지 않았을 때
  if (!authenticated) {
    return (
      <button
        className="btn btn-primary btn-sm"
        onClick={() => {
          console.log("Login button clicked");
          login();
        }}
      >
        Connect Wallet
      </button>
    );
  }

  // 로그인은 했지만 지갑이 없을 때
  if (!address) {
    return (
      <div className="flex gap-2">
        <button
          className="btn btn-primary btn-sm"
          onClick={async () => {
            console.log("Creating/Linking wallet...");
            // Privy 모달을 다시 열어서 지갑 옵션 표시
            login();
          }}
        >
          Connect Wallet
        </button>
        <button
          className="btn btn-sm btn-ghost text-xs"
          onClick={() => {
            console.log("Logging out...");
            logout();
          }}
        >
          Logout
        </button>
      </div>
    );
  }

  // 잘못된 네트워크일 때
  if (chain && chain.id !== targetNetwork.id) {
    return (
      <div className="dropdown dropdown-end">
        <label tabIndex={0} className="btn btn-error btn-sm dropdown-toggle">
          <span>Wrong Network</span>
          <span className="text-xs">▼</span>
        </label>
        <ul tabIndex={0} className="dropdown-content menu p-2 mt-1 shadow-lg bg-base-100 rounded-box w-52 gap-1">
          <li>
            <span className="text-xs">
              <span className="font-bold">Connect to:</span>
            </span>
          </li>
          <li>
            <button
              className="btn btn-sm"
              style={{ color: networkColor }}
              onClick={() => {
                try {
                  switchChain({ chainId: targetNetwork.id });
                } catch {
                  // Fallback: open Privy modal so user can try again if wallet rejects
                  login();
                }
              }}
            >
              {targetNetwork.name}
            </button>
          </li>
        </ul>
      </div>
    );
  }

  // 연결되었을 때
  return (
    <div className="flex items-center gap-2">
      {address && (
        <>
          <div className="flex flex-col items-center mr-1">
            <Balance address={address as Address} className="min-h-0 h-auto" />
            <span className="text-xs" style={{ color: networkColor }}>
              {chain?.name || targetNetwork.name}
            </span>
          </div>
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-secondary btn-sm gap-2">
              <span className="truncate max-w-[120px]">
                {user?.email?.address ||
                  user?.google?.email ||
                  user?.twitter?.username ||
                  `${address.slice(0, 6)}...${address.slice(-4)}`}
              </span>
              <span className="text-xs">▼</span>
            </label>
            <ul tabIndex={0} className="dropdown-content menu p-2 mt-1 shadow-lg bg-base-100 rounded-box w-64 gap-1">
              <li>
                <div className="text-xs break-all">
                  <span className="font-bold">Address:</span>
                  <span className="ml-1">{address}</span>
                </div>
              </li>
              {user?.email?.address && (
                <li>
                  <div className="text-xs">
                    <span className="font-bold">Email:</span>
                    <span className="ml-1">{user.email.address}</span>
                  </div>
                </li>
              )}
              <li>
                <button className="btn btn-sm btn-error" onClick={logout}>
                  Disconnect
                </button>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};
