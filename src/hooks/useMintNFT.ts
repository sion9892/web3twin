import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { CONTRACT_ADDRESS } from '../lib/wagmi';
import { type SimilarityResult } from '../lib/similarity';

// ABI for Web3TwinNFT contract
const CONTRACT_ABI = [
  {
    "inputs": [
      {"name": "_user1", "type": "address"},
      {"name": "_user2", "type": "address"},
      {"name": "_similarity", "type": "uint256"},
      {"name": "_sharedHashtags", "type": "string"},
      {"name": "_sharedEmojis", "type": "string"},
      {"name": "_tokenURI", "type": "string"}
    ],
    "name": "mintTwinNFT",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "_user1", "type": "address"},
      {"name": "_user2", "type": "address"},
      {"name": "_similarity", "type": "uint256"},
      {"name": "_sharedHashtags", "type": "string"},
      {"name": "_sharedEmojis", "type": "string"},
      {"name": "_tokenURI", "type": "string"}
    ],
    "name": "mintTwinNFTGasless",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

export function useMintNFT() {
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

  const mintNFT = async (
    user1Address: string,
    user2Address: string,
    result: SimilarityResult
  ) => {
    console.log('=== NFT Minting Debug ===');
    console.log('User1 Address:', user1Address);
    console.log('User2 Address:', user2Address);
    console.log('Similarity Result:', result);
    console.log('Contract Address:', CONTRACT_ADDRESS.hardhat);
    
    // Generate token URI with metadata
    const tokenURI = generateTokenURI(result);
    console.log('Generated Token URI:', tokenURI);
    
    const contractArgs = [
      user1Address as `0x${string}`,
      user2Address as `0x${string}`,
      BigInt(Math.round(result.similarity * 10)), // Convert to basis points
      result.sharedHashtags.join(', '),
      result.sharedEmojis.join(' '),
      tokenURI
    ];
    
    console.log('Contract Args:', contractArgs);
    console.log('Calling writeContract...');
    
    await writeContract({
      address: CONTRACT_ADDRESS.base, // Base 메인넷 사용
      abi: CONTRACT_ABI,
      functionName: 'mintTwinNFT', // 일반 민팅 사용
      args: contractArgs,
      gas: BigInt(500000), // 가스 한도 설정
    });
    
    console.log('writeContract call completed');
  };

  return {
    mintNFT,
    hash,
    error,
    isPending,
    isConfirming,
    isConfirmed,
  };
}

function generateTokenURI(result: SimilarityResult): string {
  const metadata = {
    name: `Web3Twin Match - ${result.username}`,
    description: `You found your Web3Twin! ${result.similarity.toFixed(1)}% similarity with @${result.username}`,
    image: "https://web3twin.vercel.app/images/twin-nft.png",
    attributes: [
      {
        trait_type: "Similarity",
        value: result.similarity.toFixed(1) + "%"
      },
      {
        trait_type: "Shared Hashtags",
        value: result.sharedHashtags.length
      },
      {
        trait_type: "Shared Emojis", 
        value: result.sharedEmojis.length
      },
      {
        trait_type: "GM Streak Match",
        value: result.matchingGmStreak ? "Yes" : "No"
      }
    ]
  };

  return `data:application/json,${encodeURIComponent(JSON.stringify(metadata))}`;
}
