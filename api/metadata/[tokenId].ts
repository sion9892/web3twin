import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';

const CONTRACT_ADDRESS = '0x9896849284779B561fbE4420F56b93a46b2efB39';

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

    // Get tokenURI from contract
    const tokenURI = await publicClient.readContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'tokenURI',
      args: [BigInt(tokenIdNum)],
    });

    if (!tokenURI) {
      return res.status(404).json({ error: 'Token not found' });
    }

    // Parse data URI if it's a data URI
    let metadata: any;
    if (tokenURI.startsWith('data:application/json,')) {
      // Extract JSON from data URI
      const jsonStr = decodeURIComponent(tokenURI.replace('data:application/json,', ''));
      metadata = JSON.parse(jsonStr);
    } else if (tokenURI.startsWith('data:application/json;base64,')) {
      // Handle base64 encoded data URI
      const base64Str = tokenURI.replace('data:application/json;base64,', '');
      const jsonStr = Buffer.from(base64Str, 'base64').toString('utf-8');
      metadata = JSON.parse(jsonStr);
    } else {
      // If it's already a URL, fetch it
      const response = await fetch(tokenURI);
      metadata = await response.json();
    }

    // Replace image data URI with HTTP URL
    if (metadata.image && metadata.image.startsWith('data:image/')) {
      const baseUrl = process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}` 
        : 'https://web3twin.vercel.app';
      metadata.image = `${baseUrl}/api/image/${tokenId}`;
    }

    return res.status(200).json(metadata);
  } catch (error: any) {
    console.error('Error fetching metadata:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch metadata',
      message: error.message 
    });
  }
}

