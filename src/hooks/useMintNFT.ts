import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
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

  // Debug state changes
  console.log('🔍 Minting States:', {
    isPending,
    isConfirming,
    isConfirmed,
    hash: hash ? `${hash.slice(0, 10)}...` : 'null',
    error: error?.message || 'none'
  });

  const mintNFT = async (
    user1Address: string,
    user2Address: string,
    result: SimilarityResult,
    user1Username?: string
  ) => {
    console.log('=== NFT Minting Debug ===');
    console.log('User1 Address:', user1Address);
    console.log('User2 Address:', user2Address);
    console.log('Similarity Result:', result);
    console.log('Contract Address:', CONTRACT_ADDRESS.baseSepolia);
    
    // Generate token URI with metadata
    const tokenURI = generateTokenURI(result, user1Username);
    console.log('Generated Token URI:', tokenURI);
    
    const contractArgs = [
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
      console.log('Contract Address:', CONTRACT_ADDRESS.baseSepolia);
      console.log('Function:', 'mintTwinNFT');
      console.log('Args:', {
        user1: contractArgs[0],
        user2: contractArgs[1],
        similarity: contractArgs[2].toString(),
        hashtags: contractArgs[3],
        emojis: contractArgs[4],
        tokenURI: contractArgs[5].substring(0, 100) + '...'
      });
      
      const tx = await writeContract({
        address: CONTRACT_ADDRESS.baseSepolia,
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
  };
}

function generateTokenURI(result: SimilarityResult, user1Username?: string): string {
  // Generate cute cat SVG based on similarity
  const catColor = result.similarity > 80 ? '#FF69B4' : result.similarity > 60 ? '#FFB6C1' : '#FFC0CB';
  const username1 = user1Username || 'You';
  const username2 = result.username;
  
  console.log('🎨 Generating NFT with usernames:', { username1, username2 });
  
  const catSVG = `
    <svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Background -->
      <rect width="400" height="400" fill="url(#bg)"/>
      
      <!-- Stars -->
      <circle cx="80" cy="80" r="2" fill="white" opacity="0.8"/>
      <circle cx="320" cy="100" r="2" fill="white" opacity="0.8"/>
      <circle cx="350" cy="200" r="2" fill="white" opacity="0.8"/>
      <circle cx="50" cy="250" r="2" fill="white" opacity="0.8"/>
      
      <!-- Cat Body -->
      <ellipse cx="200" cy="250" rx="80" ry="100" fill="${catColor}"/>
      
      <!-- Cat Head -->
      <circle cx="200" cy="160" r="70" fill="${catColor}"/>
      
      <!-- Left Ear -->
      <path d="M 150 130 Q 140 80 160 100 Z" fill="${catColor}"/>
      <path d="M 155 120 Q 150 95 165 105 Z" fill="#FFE4E1"/>
      
      <!-- Right Ear -->
      <path d="M 250 130 Q 260 80 240 100 Z" fill="${catColor}"/>
      <path d="M 245 120 Q 250 95 235 105 Z" fill="#FFE4E1"/>
      
      <!-- Eyes -->
      <ellipse cx="180" cy="155" rx="12" ry="18" fill="white"/>
      <ellipse cx="220" cy="155" rx="12" ry="18" fill="white"/>
      <ellipse cx="182" cy="160" rx="8" ry="12" fill="#333"/>
      <ellipse cx="222" cy="160" rx="8" ry="12" fill="#333"/>
      <ellipse cx="183" cy="156" rx="3" ry="5" fill="white"/>
      <ellipse cx="223" cy="156" rx="3" ry="5" fill="white"/>
      
      <!-- Nose -->
      <path d="M 200 175 L 195 180 L 205 180 Z" fill="#FF69B4"/>
      
      <!-- Mouth -->
      <path d="M 200 180 Q 190 185 185 180" stroke="#333" stroke-width="2" fill="none"/>
      <path d="M 200 180 Q 210 185 215 180" stroke="#333" stroke-width="2" fill="none"/>
      
      <!-- Whiskers -->
      <line x1="140" y1="165" x2="100" y2="160" stroke="#333" stroke-width="2"/>
      <line x1="140" y1="175" x2="100" y2="175" stroke="#333" stroke-width="2"/>
      <line x1="260" y1="165" x2="300" y2="160" stroke="#333" stroke-width="2"/>
      <line x1="260" y1="175" x2="300" y2="175" stroke="#333" stroke-width="2"/>
      
      <!-- Paws -->
      <ellipse cx="160" cy="330" rx="20" ry="25" fill="${catColor}"/>
      <ellipse cx="240" cy="330" rx="20" ry="25" fill="${catColor}"/>
      
      <!-- Tail -->
      <path d="M 270 280 Q 320 260 340 300 Q 350 320 330 330" 
            stroke="${catColor}" stroke-width="30" fill="none" stroke-linecap="round"/>
      
      <!-- Heart -->
      <path d="M 200 120 
               C 200 110, 190 100, 180 100
               C 170 100, 165 105, 165 115
               C 165 125, 175 135, 200 150
               C 225 135, 235 125, 235 115
               C 235 105, 230 100, 220 100
               C 210 100, 200 110, 200 120 Z" 
            fill="#FF1493" opacity="0.8"/>
      
      <!-- Similarity Badge -->
      <circle cx="320" cy="320" r="35" fill="white" opacity="0.9"/>
      <text x="320" y="320" text-anchor="middle" 
            font-family="Arial, sans-serif" font-size="16" font-weight="bold" 
            fill="#667eea" dy=".3em">${Math.round(result.similarity)}%</text>
      
      <!-- Username Background Box -->
      <rect x="20" y="345" width="360" height="50" fill="rgba(0, 0, 0, 0.6)" rx="10"/>
      
      <!-- Twin Usernames - Large and Clear -->
      <text x="200" y="365" text-anchor="middle" 
            font-family="Arial, sans-serif" font-size="14" font-weight="600" 
            fill="#FFD700" letter-spacing="1">@${username1}</text>
      
      <text x="200" y="378" text-anchor="middle" 
            font-family="Arial, sans-serif" font-size="18" font-weight="bold" 
            fill="white">×</text>
      
      <text x="200" y="391" text-anchor="middle" 
            font-family="Arial, sans-serif" font-size="14" font-weight="600" 
            fill="#FF69B4" letter-spacing="1">@${username2}</text>
    </svg>
  `;
  
  const svgBase64 = btoa(unescape(encodeURIComponent(catSVG)));
  
  const metadata = {
    name: `Twin Cats: @${username1} & @${username2} 🐱✨`,
    description: `🎭 Twin Match Found! @${username1} and @${username2} are Twin Cats with ${result.similarity.toFixed(1)}% purrfect compatibility on Farcaster! They share ${result.sharedHashtags.length} common interests${result.sharedHashtags.length > 0 ? ': ' + result.sharedHashtags.slice(0, 3).join(', ') : ''}. Meow! 😻`,
    image: `data:image/svg+xml;base64,${svgBase64}`,
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
        trait_type: "Purrfection Score",
        value: result.similarity.toFixed(1) + "%"
      },
      {
        trait_type: "Cat Mood",
        value: result.similarity > 80 ? "Ecstatic 😻" : result.similarity > 60 ? "Happy 😺" : "Friendly 😸"
      },
      {
        trait_type: "Shared Topics",
        value: result.sharedHashtags.length
      },
      {
        trait_type: "GM Streak",
        value: result.matchingGmStreak ? "Purring ✨" : "Napping 💤"
      },
      {
        trait_type: "Cat Color",
        value: result.similarity > 80 ? "Hot Pink" : result.similarity > 60 ? "Light Pink" : "Soft Pink"
      }
    ]
  };

  return `data:application/json,${encodeURIComponent(JSON.stringify(metadata))}`;
}