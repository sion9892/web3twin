import { useReadContract, useAccount } from 'wagmi';
import { CONTRACT_ADDRESS } from '../lib/wagmi';

// ABI for reading user NFTs
const CONTRACT_ABI = [
  {
    "inputs": [{"name": "_user", "type": "address"}],
    "name": "getUserTokens",
    "outputs": [{"name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "_tokenId", "type": "uint256"}],
    "name": "getTwinMatch",
    "outputs": [
      {
        "components": [
          {"name": "user1", "type": "address"},
          {"name": "user2", "type": "address"},
          {"name": "similarity", "type": "uint256"},
          {"name": "timestamp", "type": "uint256"},
          {"name": "sharedHashtags", "type": "string"},
          {"name": "sharedEmojis", "type": "string"}
        ],
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "_tokenId", "type": "uint256"}],
    "name": "tokenURI",
    "outputs": [{"name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export interface UserNFT {
  tokenId: number;
  twinMatch: {
    user1: string;
    user2: string;
    similarity: number;
    timestamp: number;
    sharedHashtags: string;
    sharedEmojis: string;
  };
  tokenURI: string;
}

export function useUserNFTs() {
  const { address } = useAccount();
  
  const { 
    data: tokenIds, 
    isLoading: isLoadingTokens,
    refetch: refetchTokens
  } = useReadContract({
    address: CONTRACT_ADDRESS.hardhat,
    abi: CONTRACT_ABI,
    functionName: 'getUserTokens',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  return {
    tokenIds: tokenIds as bigint[] | undefined,
    isLoadingTokens,
    refetchTokens,
  };
}

export function useNFTDetails(tokenId: number) {
  const { data: twinMatch } = useReadContract({
    address: CONTRACT_ADDRESS.hardhat,
    abi: CONTRACT_ABI,
    functionName: 'getTwinMatch',
    args: [BigInt(tokenId)],
    query: {
      enabled: tokenId > 0,
    },
  });

  const { data: tokenURI } = useReadContract({
    address: CONTRACT_ADDRESS.hardhat,
    abi: CONTRACT_ABI,
    functionName: 'tokenURI',
    args: [BigInt(tokenId)],
    query: {
      enabled: tokenId > 0,
    },
  });

  return {
    twinMatch,
    tokenURI,
  };
}
