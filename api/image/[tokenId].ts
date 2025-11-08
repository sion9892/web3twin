import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';

const CONTRACT_ADDRESS = '0x7CBab43654db47850c4B0422E8Bbc63FAd6D5c99';

const CONTRACT_ABI = [
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

    // Generate SVG from twin match data
    const similarity = Number(twinMatch.similarity);
    const user1Address = twinMatch.user1;
    const user2Address = twinMatch.user2;
    
    // Shorten addresses for display
    const user1Short = `${user1Address.slice(0, 6)}...${user1Address.slice(-4)}`;
    const user2Short = `${user2Address.slice(0, 6)}...${user2Address.slice(-4)}`;

    // Generate SVG (simplified version - can be enhanced later)
    const svg = `
<svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="nightBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0e27;stop-opacity:1" />
      <stop offset="30%" style="stop-color:#1a1f3a;stop-opacity:1" />
      <stop offset="70%" style="stop-color:#1f285d;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#2d1b4e;stop-opacity:1" />
    </linearGradient>
    <radialGradient id="milkyWay" cx="50%" cy="30%" r="60%">
      <stop offset="0%" style="stop-color:#2a3a5f;stop-opacity:0.4" />
      <stop offset="50%" style="stop-color:#1f285d;stop-opacity:0.2" />
      <stop offset="100%" style="stop-color:#0a0e27;stop-opacity:0" />
    </radialGradient>
    <linearGradient id="profile1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="profile2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f5576c;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ff6b9d;stop-opacity:1" />
    </linearGradient>
    <filter id="starGlow">
      <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <rect width="400" height="400" fill="url(#nightBg)"/>
  <ellipse cx="200" cy="120" rx="180" ry="60" fill="url(#milkyWay)" opacity="0.6"/>
  
  <!-- Stars -->
  <g filter="url(#starGlow)" opacity="0.8">
    <circle cx="80" cy="80" r="1.5" fill="#ffffff">
      <animate attributeName="opacity" values="0.9;0.3;0.9;1;0.9" dur="3s" repeatCount="indefinite"/>
    </circle>
    <circle cx="210" cy="70" r="1.8" fill="#fffac2">
      <animate attributeName="opacity" values="0.9;0.3;0.9;1;0.9" dur="3s" begin="0.5s" repeatCount="indefinite"/>
    </circle>
    <circle cx="340" cy="100" r="1.5" fill="#ffffff">
      <animate attributeName="opacity" values="0.9;0.3;0.9;1;0.9" dur="3s" begin="1s" repeatCount="indefinite"/>
    </circle>
    <circle cx="50" cy="320" r="1.5" fill="#ffffff">
      <animate attributeName="opacity" values="0.9;0.3;0.9;1;0.9" dur="3s" begin="1.5s" repeatCount="indefinite"/>
    </circle>
    <circle cx="350" cy="300" r="1.5" fill="#fffac2">
      <animate attributeName="opacity" values="0.9;0.3;0.9;1;0.9" dur="3s" repeatCount="indefinite"/>
    </circle>
  </g>
  
  <!-- User 2 Profile (Left) -->
  <circle cx="130" cy="180" r="65" fill="url(#profile2)"/>
  <circle cx="130" cy="180" r="70" fill="none" stroke="white" stroke-width="5"/>
  
  <!-- User 1 Profile (Right) -->
  <circle cx="270" cy="180" r="65" fill="url(#profile1)"/>
  <circle cx="270" cy="180" r="70" fill="none" stroke="white" stroke-width="5"/>
  
  <!-- X Symbol in the center -->
  <g transform="translate(200, 180)">
    <circle cx="0" cy="0" r="25" fill="white" opacity="0.9"/>
    <text x="0" y="0" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="#667eea" dy=".35em">×</text>
  </g>
  
  <!-- Username Section -->
  <rect x="20" y="290" width="360" height="110" fill="rgba(255, 255, 255, 0.95)" rx="20" ry="20"/>
  
  <text x="130" y="325" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#f5576c" dy=".3em">${user2Short}</text>
  
  <text x="270" y="325" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#667eea" dy=".3em">${user1Short}</text>
  
  <line x1="200" y1="310" x2="200" y2="350" stroke="#e5e7eb" stroke-width="2" stroke-dasharray="5,5"/>
  
  <text x="200" y="365" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" font-weight="600" fill="#9ca3af" dy=".3em">${similarity.toFixed(1)}% Match</text>
</svg>`.trim();

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

