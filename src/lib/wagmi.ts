import { createConfig, http } from 'wagmi';
import { base } from 'wagmi/chains';
import { baseAccount } from 'wagmi/connectors';

export const config = createConfig({
  chains: [base],
  connectors: [
    baseAccount({
      appName: 'Web3Twin',
    }),
  ],
  transports: {
    [base.id]: http(),
  },
  ssr: true,
});

export const CONTRACT_ADDRESS = {
  base: '0x8bD8E7e65c6cd8DE4aF4eB15c634560489366509',
} as const;
