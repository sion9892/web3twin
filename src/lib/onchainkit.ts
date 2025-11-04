import { base } from 'viem/chains';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { WalletProvider } from '@coinbase/onchainkit/wallet';
import type { OnchainKitProviderReact } from '@coinbase/onchainkit';

export const onchainKitConfig: Omit<OnchainKitProviderReact, 'children'> = {
  chain: base,
  apiKey: import.meta.env.VITE_COINBASE_API_KEY || '',
  rpcUrl: import.meta.env.VITE_BASE_RPC_URL || 'https://mainnet.base.org',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '00000000000000000000000000000000', // Must be 32 chars - get from https://cloud.walletconnect.com
};

export { OnchainKitProvider, WalletProvider, base };

