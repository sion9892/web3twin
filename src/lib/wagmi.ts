import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { baseSepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Web3Twin',
  projectId: 'demo-project-id-for-local-dev',
  chains: [baseSepolia],
  ssr: true,
  walletConnectOptions: {
    showQrModal: false,
  },
});

export const CONTRACT_ADDRESS = {
  baseSepolia: '0x9405955F3061342bDaf064f338a5dc44C435c69c',
} as const;
