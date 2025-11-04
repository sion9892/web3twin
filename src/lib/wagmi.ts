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
  base: '0x9896849284779B561fbE4420F56b93a46b2efB39',
} as const;
