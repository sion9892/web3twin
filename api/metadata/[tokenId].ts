import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';

const CONTRACT_ADDRESS = '0x8bD8E7e65c6cd8DE4aF4eB15c634560489366509';

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
  }
] as const;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { tokenId } = req.query;

    if (!tokenId || typeof tokenId !== 'string') {
      return res.status(400).json({ error: 'Missing tokenId parameter' });
    }

    const tokenIdNum = parseInt(tokenId, 10);
    if (isNaN(tokenIdNum)) {
      return res.status(400).json({ error: 'Invalid tokenId' });
    }

    // Create public client to read from contract
    const publicClient = createPublicClient({
      chain: base,
      transport: http(),
    });

    // Get twin match data from contract
    const twinMatch = await publicClient.readContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'getTwinMatch',
      args: [BigInt(tokenIdNum)],
    });

    if (!twinMatch) {
      return res.status(404).json({ error: 'Token not found' });
    }

    // Generate metadata from twin match data
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'https://web3twin.vercel.app';
    
    const similarity = Number(twinMatch.similarity);
    const sharedHashtags = twinMatch.sharedHashtags ? twinMatch.sharedHashtags.split(', ').filter(Boolean) : [];
    
    const metadata = {
      name: `Twin Match #${tokenId} - ${similarity}% Match`,
      description: `✨ Starry Night Match Found! Two Farcaster users share a ${similarity}% compatibility under the stars! They share ${sharedHashtags.length} common interests${sharedHashtags.length > 0 ? ': ' + sharedHashtags.slice(0, 3).join(', ') : ''}. A beautiful connection in the night sky! ⭐`,
      image: `${baseUrl}/api/image/${tokenId}`,
      attributes: [
        {
          trait_type: "Similarity Score",
          value: similarity.toFixed(1) + "%"
        },
        {
          trait_type: "Night Sky Mood",
          value: similarity > 80 ? "Brilliant ✨" : similarity > 60 ? "Starry 🌟" : "Moonlit 🌙"
        },
        {
          trait_type: "Shared Topics",
          value: sharedHashtags.length
        },
        {
          trait_type: "Sky Color",
          value: similarity > 80 ? "Starry Blue" : similarity > 60 ? "Deep Blue" : "Midnight Blue"
        }
      ]
    };

    return res.status(200).json(metadata);
  } catch (error: any) {
    console.error('Error fetching metadata:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch metadata',
      message: error.message 
    });
  }
}

