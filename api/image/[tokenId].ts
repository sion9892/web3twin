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
  }
] as const;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'image/svg+xml');

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

    // Parse data URI to extract SVG
    let svg: string;
    if (tokenURI.startsWith('data:application/json,')) {
      // Extract JSON from data URI
      const jsonStr = decodeURIComponent(tokenURI.replace('data:application/json,', ''));
      const metadata = JSON.parse(jsonStr);
      
      if (metadata.image && metadata.image.startsWith('data:image/svg+xml;base64,')) {
        // Extract SVG from base64
        const base64Str = metadata.image.replace('data:image/svg+xml;base64,', '');
        svg = Buffer.from(base64Str, 'base64').toString('utf-8');
      } else if (metadata.image && metadata.image.startsWith('data:image/svg+xml,')) {
        // Extract SVG from URL encoded
        svg = decodeURIComponent(metadata.image.replace('data:image/svg+xml,', ''));
      } else {
        return res.status(500).json({ error: 'Image not found in metadata' });
      }
    } else if (tokenURI.startsWith('data:application/json;base64,')) {
      // Handle base64 encoded data URI
      const base64Str = tokenURI.replace('data:application/json;base64,', '');
      const jsonStr = Buffer.from(base64Str, 'base64').toString('utf-8');
      const metadata = JSON.parse(jsonStr);
      
      if (metadata.image && metadata.image.startsWith('data:image/svg+xml;base64,')) {
        const imageBase64 = metadata.image.replace('data:image/svg+xml;base64,', '');
        svg = Buffer.from(imageBase64, 'base64').toString('utf-8');
      } else {
        return res.status(500).json({ error: 'Image not found in metadata' });
      }
    } else {
      return res.status(500).json({ error: 'Unsupported tokenURI format' });
    }

    // Return SVG with proper headers
    return res.status(200).send(svg);
  } catch (error: any) {
    console.error('Error fetching image:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch image',
      message: error.message 
    });
  }
}

