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
  base: '0x7CBab43654db47850c4B0422E8Bbc63FAd6D5c99',
} as const;
