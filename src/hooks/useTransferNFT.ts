import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_ADDRESS } from '../lib/wagmi';

// ABI for NFT transfer (ERC721 standard)
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
      {"name": "from", "type": "address"},
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
    console.log('🔄 Starting NFT Transfer...');
    console.log('From:', fromAddress);
    console.log('To:', toAddress);
    console.log('Token ID:', tokenId);
    console.log('Contract:', CONTRACT_ADDRESS.baseSepolia);
    
    try {
      const args = [
        fromAddress as `0x${string}`,
        toAddress as `0x${string}`,
        BigInt(tokenId)
      ];
      
      console.log('Transfer args:', args);
      
      await writeContract({
        address: CONTRACT_ADDRESS.baseSepolia,
        abi: CONTRACT_ABI,
        functionName: 'safeTransferFrom',
        args: args,
      });
      
      console.log('✅ Transfer transaction sent successfully');
    } catch (err: any) {
      console.error('❌ Error transferring NFT:', err);
      console.error('Error details:', {
        message: err?.message,
        code: err?.code,
        data: err?.data,
      });
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
