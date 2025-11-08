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
  base: '0xbc0A506a658f3013AFB5941F37628d008306309B',
} as const;
