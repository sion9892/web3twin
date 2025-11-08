// NFT 메타데이터 확인 스크립트
const { createPublicClient, http } = require('viem');
const { base } = require('viem/chains');

const CONTRACT_ADDRESS = '0xbc0A506a658f3013AFB5941F37628d008306309B';

const CONTRACT_ABI = [
  {
    "inputs": [{"name": "_tokenId", "type": "uint256"}],
    "name": "tokenURI",
    "outputs": [{"name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "_user", "type": "address"}],
    "name": "getUserTokens",
    "outputs": [{"name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  }
];

async function checkNFTMetadata(tokenId) {
  const publicClient = createPublicClient({
    chain: base,
    transport: http('https://mainnet.base.org'),
  });

  try {
    // Get tokenURI
    const tokenURI = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'tokenURI',
      args: [BigInt(tokenId)],
    });

    console.log(`\n📋 Token ID: ${tokenId}`);
    console.log(`🔗 tokenURI: ${tokenURI}`);

    // Fetch metadata
    const metadataResponse = await fetch(tokenURI);
    if (!metadataResponse.ok) {
      console.error(`❌ Failed to fetch metadata: ${metadataResponse.status}`);
      return;
    }

    const metadata = await metadataResponse.json();
    console.log(`\n📝 Metadata:`);
    console.log(`  Name: ${metadata.name}`);
    console.log(`  Image: ${metadata.image}`);
    console.log(`  Image URL type: ${metadata.image?.startsWith('http') ? 'HTTP ✅' : 'IPFS ❌'}`);
    console.log(`  Description: ${metadata.description?.substring(0, 100)}...`);

    // Check if image URL is accessible
    if (metadata.image) {
      console.log(`\n🖼️  Checking image accessibility...`);
      const imageResponse = await fetch(metadata.image, { method: 'HEAD' });
      console.log(`  Image URL: ${metadata.image}`);
      console.log(`  Status: ${imageResponse.status} ${imageResponse.ok ? '✅' : '❌'}`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Usage: node scripts/check-nft-metadata.js <tokenId>
const tokenId = process.argv[2];
if (!tokenId) {
  console.log('Usage: node scripts/check-nft-metadata.js <tokenId>');
  process.exit(1);
}

checkNFTMetadata(tokenId);

