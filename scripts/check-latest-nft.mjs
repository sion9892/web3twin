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
  },
  {
    "inputs": [],
    "name": "_nextTokenId",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

async function checkLatestNFT() {
  const publicClient = createPublicClient({
    chain: base,
    transport: http('https://mainnet.base.org'),
  });

  try {
    // Get next token ID (current total supply)
    const nextTokenId = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: '_nextTokenId',
    });

    const latestTokenId = Number(nextTokenId) - 1;
    console.log(`\n📊 Latest Token ID: ${latestTokenId}`);
    console.log(`📊 Next Token ID: ${Number(nextTokenId)}\n`);

    if (latestTokenId <= 0) {
      console.log('No NFTs minted yet.');
      return;
    }

    // Check last 3 tokens
    for (let i = Math.max(1, latestTokenId - 2); i <= latestTokenId; i++) {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`📋 Checking Token ID: ${i}`);
      
      const tokenURI = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'tokenURI',
        args: [BigInt(i)],
      });

      console.log(`🔗 tokenURI: ${tokenURI}`);

      // Check if tokenURI is valid
      if (!tokenURI || tokenURI === '') {
        console.log('❌ Empty tokenURI');
        continue;
      }

      // Try to fetch metadata
      try {
        const metadataResponse = await fetch(tokenURI);
        if (!metadataResponse.ok) {
          console.error(`❌ Failed to fetch metadata: ${metadataResponse.status}`);
          const text = await metadataResponse.text();
          console.error(`Response: ${text.substring(0, 200)}`);
          continue;
        }

        const metadata = await metadataResponse.json();
        console.log(`✅ Metadata fetched successfully`);
        console.log(`  Name: ${metadata.name}`);
        console.log(`  Image: ${metadata.image}`);
        console.log(`  Image URL type: ${metadata.image?.startsWith('http') ? 'HTTP ✅' : metadata.image?.startsWith('ipfs://') ? 'IPFS ❌' : 'UNKNOWN ❌'}`);

        // Check image accessibility
        if (metadata.image) {
          try {
            const imageResponse = await fetch(metadata.image, { method: 'HEAD' });
            console.log(`  Image Status: ${imageResponse.status} ${imageResponse.ok ? '✅' : '❌'}`);
          } catch (error) {
            console.error(`  ❌ Image fetch error: ${error.message}`);
          }
        }
      } catch (error) {
        console.error(`❌ Error fetching metadata: ${error.message}`);
      }
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  }
}

checkLatestNFT();
