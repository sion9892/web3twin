import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base, baseSepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Web3Twin',
  projectId: 'YOUR_PROJECT_ID', // WalletConnect Project ID
  chains: [
    base,
    baseSepolia,
  ],
  ssr: true,
});

export const CONTRACT_ADDRESS = {
  base: '0x...', // 배포 후 업데이트
  baseSepolia: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', // 테스트용 컨트랙트 주소 (실제로는 배포 후 업데이트 필요)
} as const;

// Base 네트워크 가스비 정보
export const GAS_INFO = {
  base: {
    name: 'Base',
    gasPrice: '0.001 USD', // 매우 저렴!
    description: 'Base는 Ethereum Layer 2로 가스비가 매우 저렴합니다'
  },
  ethereum: {
    name: 'Ethereum',
    gasPrice: '5-50 USD', // 매우 비쌈
    description: 'Ethereum 메인넷은 가스비가 비쌉니다'
  }
} as const;
