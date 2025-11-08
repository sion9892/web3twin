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
  base: '0x2C4C60cfF5CB69B3Cb6BEd2f28fFBDd7F8987706',
} as const;
