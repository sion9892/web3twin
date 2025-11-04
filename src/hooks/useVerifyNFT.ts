import { useReadContract, useAccount } from 'wagmi';
import { CONTRACT_ADDRESS } from '../lib/wagmi';

const CONTRACT_ABI = [
  {
    "inputs": [{"name": "_tokenId", "type": "uint256"}],
    "name": "tokenURI",
    "outputs": [{"name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "_tokenId", "type": "uint256"}],
    "name": "ownerOf",
    "outputs": [{"name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export function useVerifyNFT(tokenId: number | null) {
  const { address } = useAccount();
  
  const { 
    data: tokenURI, 
    isLoading: isLoadingURI,
    error: uriError
  } = useReadContract({
    address: CONTRACT_ADDRESS.base,
    abi: CONTRACT_ABI,
    functionName: 'tokenURI',
    args: tokenId !== null ? [BigInt(tokenId)] : undefined,
    query: {
      enabled: tokenId !== null,
    },
  });

  const { 
    data: owner, 
    isLoading: isLoadingOwner,
    error: ownerError
  } = useReadContract({
    address: CONTRACT_ADDRESS.base,
    abi: CONTRACT_ABI,
    functionName: 'ownerOf',
    args: tokenId !== null ? [BigInt(tokenId)] : undefined,
    query: {
      enabled: tokenId !== null,
    },
  });

  return {
    tokenURI: tokenURI as string | undefined,
    owner: owner as string | undefined,
    isLoading: isLoadingURI || isLoadingOwner,
    errors: { uriError, ownerError },
    isOwnedByUser: owner?.toLowerCase() === address?.toLowerCase(),
  };
}

