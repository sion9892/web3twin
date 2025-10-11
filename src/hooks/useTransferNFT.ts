import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_ADDRESS } from '../lib/wagmi';

// ABI for NFT transfer
const CONTRACT_ABI = [
  {
    "inputs": [
      {"name": "from", "type": "address"},
      {"name": "to", "type": "address"},
      {"name": "tokenId", "type": "uint256"}
    ],
    "name": "transferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "to", "type": "address"},
      {"name": "tokenId", "type": "uint256"}
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "tokenId", "type": "uint256"}
    ],
    "name": "ownerOf",
    "outputs": [{"name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export function useTransferNFT() {
  const { 
    data: hash, 
    error, 
    isPending, 
    writeContract 
  } = useWriteContract();

  const { 
    isLoading: isConfirming, 
    isSuccess: isConfirmed 
  } = useWaitForTransactionReceipt({
    hash,
  });

  const transferNFT = async (
    fromAddress: string,
    toAddress: string,
    tokenId: number
  ) => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESS.hardhat,
        abi: CONTRACT_ABI,
        functionName: 'safeTransferFrom',
        args: [
          fromAddress as `0x${string}`,
          toAddress as `0x${string}`,
          BigInt(tokenId)
        ],
      });
    } catch (err) {
      console.error('Error transferring NFT:', err);
      throw err;
    }
  };

  return {
    transferNFT,
    hash,
    error,
    isPending,
    isConfirming,
    isConfirmed,
  };
}
