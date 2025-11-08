import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';
import { buildTwinMatchMetadata } from '../../lib/twinMetadata';

const CONTRACT_ADDRESS = '0x2C4C60cfF5CB69B3Cb6BEd2f28fFBDd7F8987706';
const IPFS_IMAGE_BASE_CID =
  'QmXTAJc96BuZ4dtX2BMiUiGeQy73AYbBXMn6yaRCcLQHaq';

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

    // First check if token exists by calling ownerOf
    let owner: string;
    try {
      owner = await publicClient.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'ownerOf',
        args: [BigInt(tokenIdNum)],
      });
    } catch (error: any) {
      // Token doesn't exist
      return res.status(404).json({ error: 'Token not found' });
    }

    // Get twin match data from contract
    let twinMatch: any;
    try {
      twinMatch = await publicClient.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'getTwinMatch',
        args: [BigInt(tokenIdNum)],
      });
    } catch (error: any) {
      console.error('Error fetching twin match:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch twin match data',
        message: error.message 
      });
    }

    if (!twinMatch) {
      return res.status(404).json({ error: 'Twin match data not found' });
    }

    // Generate metadata from twin match data
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'https://web3twin.vercel.app';
    
    const ipfsImageCid = process.env.IPFS_IMAGE_CID ?? IPFS_IMAGE_BASE_CID;

    const metadata = buildTwinMatchMetadata({
      tokenId: tokenIdNum,
      similarity: twinMatch.similarity,
      sharedHashtags: twinMatch.sharedHashtags,
      ipfsImageCid,
      imageExtension: 'svg',
      externalBaseUrl: baseUrl,
    });

    return res.status(200).json(metadata);
  } catch (error: any) {
    console.error('Error fetching metadata:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch metadata',
      message: error.message 
    });
  }
}

