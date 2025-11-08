import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';

const CONTRACT_ADDRESS = '0xbc0A506a658f3013AFB5941F37628d008306309B';

const CONTRACT_ABI = [
  {
    "inputs": [{"name": "_tokenId", "type": "uint256"}],
    "name": "tokenURI",
    "outputs": [{"name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  }
];

async function fetchTokenMetadata(tokenId) {
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
    console.log(`🔗 tokenURI: ${tokenURI}\n`);

    // Fetch metadata
    const metadataResponse = await fetch(tokenURI);
    if (!metadataResponse.ok) {
      console.error(`❌ Failed to fetch metadata: ${metadataResponse.status}`);
      const text = await metadataResponse.text();
      console.error(`Response: ${text}`);
      return;
    }

    const metadata = await metadataResponse.json();
    console.log(`📝 Metadata:`);
    console.log(`  Name: ${metadata.name}`);
    console.log(`  Image: ${metadata.image}`);
    console.log(`  Image URL type: ${metadata.image?.startsWith('http') ? 'HTTP ✅' : 'IPFS ❌'}`);
    console.log(`\n📄 Full Metadata JSON:`);
    console.log(JSON.stringify(metadata, null, 2));

    // Check if image URL is accessible
    if (metadata.image) {
      console.log(`\n🖼️  Checking image accessibility...`);
      try {
        const imageResponse = await fetch(metadata.image, { method: 'HEAD' });
        console.log(`  Image URL: ${metadata.image}`);
        console.log(`  Status: ${imageResponse.status} ${imageResponse.ok ? '✅' : '❌'}`);
      } catch (error) {
        console.error(`  ❌ Error checking image: ${error.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  }
}

// Check token ID 7
fetchTokenMetadata(7);
