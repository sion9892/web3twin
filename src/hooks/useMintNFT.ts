import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { CONTRACT_ADDRESS } from '../lib/wagmi';
import { type SimilarityResult } from '../lib/similarity';
import { generateNFTSVG } from '../lib/generateNFTSVG';
import { useEffect, useState } from 'react';

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
    data: receipt,
    isLoading: isConfirming, 
    isSuccess: isConfirmed 
  } = useWaitForTransactionReceipt({
    hash,
  });

  const [mintedTokenId, setMintedTokenId] = useState<number | null>(null);

  // Extract tokenId from transaction receipt logs
  useEffect(() => {
    if (receipt && isConfirmed) {
      // Try to get tokenId from logs (TwinMinted event)
      const logs = receipt.logs;
      if (logs && logs.length > 0) {
        // The mintTwinNFT function returns the tokenId, but we need to parse it from logs
        // For now, we'll get it from getUserTokens after mint
        console.log('📋 Transaction receipt received:', receipt);
      }
    }
  }, [receipt, isConfirmed]);

  // Get the latest tokenId after mint
  const { data: latestTokenIds } = useReadContract({
    address: CONTRACT_ADDRESS.base,
    abi: [
      {
        "inputs": [{"name": "_user", "type": "address"}],
        "name": "getUserTokens",
        "outputs": [{"name": "", "type": "uint256[]"}],
        "stateMutability": "view",
        "type": "function"
      }
    ],
    functionName: 'getUserTokens',
    args: receipt?.from ? [receipt.from as `0x${string}`] : undefined,
    query: {
      enabled: !!receipt && isConfirmed,
    },
  });

  useEffect(() => {
    if (latestTokenIds && Array.isArray(latestTokenIds) && latestTokenIds.length > 0) {
      const latestId = Number(latestTokenIds[latestTokenIds.length - 1]);
      setMintedTokenId(latestId);
      console.log('✅ Latest minted tokenId:', latestId);
    }
  }, [latestTokenIds]);

  // Debug state changes
  const mintNFT = async (
    user1Address: string,
    user2Address: string,
    result: SimilarityResult,
    user1Username?: string,
    user1PfpUrl?: string
  ) => {
    console.log('=== NFT Minting Debug ===');
    console.log('User1 Address:', user1Address);
    console.log('User2 Address:', user2Address);
    console.log('Similarity Result:', result);
    console.log('Contract Address:', CONTRACT_ADDRESS.base);
    
    // Generate SVG and metadata (현재는 사용하지 않지만 나중을 위해 유지)
    console.log('📤 Generating NFT metadata...');
    generateNFTData(result, user1Username, user1PfpUrl); // 호출만 하고 결과는 사용하지 않음
    
    // tokenURI는 짧은 문자열로 설정 (data URI는 너무 길어서 가스 제한에 걸림)
    // 실제 메타데이터는 api/metadata/[tokenId].ts에서 컨트랙트의 getTwinMatch를 읽어서 동적으로 생성
    // tokenId는 아직 모르므로 임시로 'temp' 사용 (컨트랙트에서 저장만 하고, 실제 조회는 getTwinMatch 사용)
    const tokenURI = 'temp';
    console.log('✅ Using short tokenURI to avoid gas limit');
    
    const contractArgs: [`0x${string}`, `0x${string}`, bigint, string, string, string] = [
      user1Address as `0x${string}`,
      user2Address as `0x${string}`,
      BigInt(Math.round(result.similarity)), // Similarity as percentage (0-100)
      result.sharedHashtags.join(', '),
      '', // Empty string for sharedEmojis (removed feature)
      tokenURI
    ];
    
    console.log('Contract Args:', contractArgs);
    console.log('Calling writeContract...');
    
    try {
      console.log('📤 Sending transaction to contract...');
      console.log('Function:', 'mintTwinNFT');
      console.log('Args:', {
        user1: contractArgs[0],
        user2: contractArgs[1],
        similarity: contractArgs[2].toString(),
        hashtags: contractArgs[3],
        emojis: contractArgs[4],
        tokenURI: (contractArgs[5] as string).substring(0, 100) + '...'
      });
      
      const tx = await writeContract({
        address: CONTRACT_ADDRESS.base,
        abi: CONTRACT_ABI,
        functionName: 'mintTwinNFT',
        args: contractArgs,
      });
      
      console.log('✅ writeContract call completed successfully');
      console.log('Transaction result:', tx);
    } catch (contractError: any) {
      console.error('❌ writeContract failed:', contractError);
      console.error('Error details:', {
        message: contractError?.message,
        code: contractError?.code,
        data: contractError?.data,
      });
      throw contractError;
    }
  };

  return {
    mintNFT,
    hash,
    error,
    isPending,
    isConfirming,
    isConfirmed,
    mintedTokenId,
  };
}

// Generate SVG and metadata (for API storage)
function generateNFTData(result: SimilarityResult, user1Username?: string, user1PfpUrl?: string): { svg: string; metadata: any } {
  // Generate NFT SVG using the shared function
  const username1 = user1Username || 'You';
  const username2 = result.username;
  
  console.log('🎨 Generating NFT with usernames:', { username1, username2 });
  console.log('🎨 User1 pfpUrl:', user1PfpUrl);
  console.log('🎨 User2 pfpUrl:', result.pfpUrl);
  
  // Use the shared generateNFTSVG function
  const catSVG = generateNFTSVG({
    user1Username: username1,
    user2Username: username2,
    user1PfpUrl: user1PfpUrl,
    user2PfpUrl: result.pfpUrl,
    similarity: result.similarity,
    textJaccard: result.textJaccard,
    hashtagOverlap: result.hashtagOverlap,
    emojiOverlap: result.emojiOverlap,
  });
  
  console.log('🎨 Generated SVG length:', catSVG.length);
  console.log('🎨 SVG preview (first 200 chars):', catSVG.substring(0, 200));
  
  // Prepare metadata (image will be set by API endpoint)
  const metadata = {
    name: `@${username2} x @${username1} - ${result.similarity.toFixed(1)}% Match`,
    description: `✨ Starry Night Match Found! @${username1} and @${username2} share a ${result.similarity.toFixed(1)}% compatibility under the stars on Farcaster! They share ${result.sharedHashtags.length} common interests${result.sharedHashtags.length > 0 ? ': ' + result.sharedHashtags.slice(0, 3).join(', ') : ''}. A beautiful connection in the night sky! ⭐`,
    image: '', // Will be set by API endpoint
    attributes: [
      {
        trait_type: "Twin 1",
        value: `@${username1}`
      },
      {
        trait_type: "Twin 2",
        value: `@${username2}`
      },
      {
        trait_type: "Stellar Match Score",
        value: result.similarity.toFixed(1) + "%"
      },
      {
        trait_type: "Night Sky Mood",
        value: result.similarity > 80 ? "Brilliant ✨" : result.similarity > 60 ? "Starry 🌟" : "Moonlit 🌙"
      },
      {
        trait_type: "Shared Topics",
        value: result.sharedHashtags.length
      },
      {
        trait_type: "Sky Color",
        value: result.similarity > 80 ? "Starry Blue" : result.similarity > 60 ? "Deep Blue" : "Midnight Blue"
      }
    ]
  };

  console.log('📝 NFT Metadata name:', metadata.name);
  console.log('📝 Full metadata size:', JSON.stringify(metadata).length, 'bytes');
  
  return { svg: catSVG, metadata };
}
