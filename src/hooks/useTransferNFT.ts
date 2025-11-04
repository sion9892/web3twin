import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_ADDRESS } from '../lib/wagmi';
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';

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
    console.log('Contract:', CONTRACT_ADDRESS.base);
    
    // Check current owner before transfer using public client
    try {
      const publicClient = createPublicClient({
        chain: base,
        transport: http(),
      });
      
      const currentOwner = await publicClient.readContract({
        address: CONTRACT_ADDRESS.base,
        abi: CONTRACT_ABI,
        functionName: 'ownerOf',
        args: [BigInt(tokenId)],
      });
      
      console.log('📋 Current NFT owner:', currentOwner);
      
      if (currentOwner?.toLowerCase() === toAddress.toLowerCase()) {
        console.log('⚠️ NFT is already owned by the target address.');
        console.log('💡 Transferring to same address may help Base App recognize the NFT.');
        console.log('💡 If NFT still doesn\'t appear in Base App, it may need time to index or refresh.');
      }
    } catch (err) {
      console.warn('Could not check current owner:', err);
    }
    
    try {
      const args: [`0x${string}`, `0x${string}`, bigint] = [
        fromAddress as `0x${string}`,
        toAddress as `0x${string}`,
        BigInt(tokenId)
      ];
      
      console.log('Transfer args:', args);
      
      await writeContract({
        address: CONTRACT_ADDRESS.base,
        abi: CONTRACT_ABI,
        functionName: 'safeTransferFrom',
        args: args,
      });
      
      console.log('✅ Transfer transaction sent successfully');
      console.log('💡 After confirmation, Base App should recognize the NFT.');
      console.log('💡 If NFT still doesn\'t appear, try refreshing Base App or wait a few minutes for indexing.');
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
