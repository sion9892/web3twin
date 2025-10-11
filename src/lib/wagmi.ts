import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base, baseSepolia, hardhat } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Web3Twin',
  projectId: '2f05a7cdeecdc0c5b3c7c8e8e8e8e8e8', // WalletConnect Project ID (demo)
  chains: [
    base, // 메인넷 (우선순위)
    baseSepolia, // 테스트넷
    hardhat, // 로컬 개발용
  ],
  ssr: true,
});

export const CONTRACT_ADDRESS = {
  hardhat: '0x5FbDB2315678afecb367f032d93F642f64180aa3', // 로컬 Hardhat 네트워크
  base: '0x...', // 배포 후 업데이트
  baseSepolia: '0x9405955F3061342bDaf064f338a5dc44C435c69c', // Base Sepolia 테스트넷 (실제 배포됨)
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
