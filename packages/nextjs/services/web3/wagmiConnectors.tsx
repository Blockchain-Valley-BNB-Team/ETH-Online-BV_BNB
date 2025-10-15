import { injected, walletConnect } from "wagmi/connectors";
import scaffoldConfig from "~~/scaffold.config";

/**
 * Wagmi connectors - Privy handles wallet connections internally
 */
export const wagmiConnectors = () => {
  // Only create connectors on client-side to avoid SSR issues
  if (typeof window === "undefined") {
    return [];
  }

  return [
    injected(),
    walletConnect({
      projectId: scaffoldConfig.walletConnectProjectId,
    }),
  ];
};
