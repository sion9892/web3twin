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

async function checkToken(tokenId) {
  const publicClient = createPublicClient({
    chain: base,
    transport: http('https://mainnet.base.org'),
  });

  try {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📋 Checking Token ID: ${tokenId}`);
    
    const tokenURI = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'tokenURI',
      args: [BigInt(tokenId)],
    });

    console.log(`🔗 tokenURI: ${tokenURI}`);
    console.log(`🔗 tokenURI length: ${tokenURI.length}`);

    if (!tokenURI || tokenURI === '') {
      console.log('❌ Empty tokenURI');
      return;
    }

    // Check tokenURI format
    if (tokenURI.includes('web3twin.vercel.app/api/metadata/https://')) {
      console.log('❌ WRONG FORMAT: API endpoint with IPFS URL');
      const ipfsUrl = tokenURI.split('api/metadata/')[1];
      console.log(`   Should be: ${ipfsUrl}`);
    } else if (tokenURI.startsWith('https://ipfs.io/ipfs/')) {
      console.log('✅ CORRECT FORMAT: Direct IPFS gateway URL');
    } else if (tokenURI.startsWith('ipfs://')) {
      console.log('⚠️  IPFS PROTOCOL: Should be HTTP gateway URL');
    } else {
      console.log('⚠️  UNKNOWN FORMAT');
    }

    // Try to fetch metadata
    try {
      console.log(`\n📤 Fetching metadata from: ${tokenURI}`);
      const metadataResponse = await fetch(tokenURI);
      if (!metadataResponse.ok) {
        console.error(`❌ Failed to fetch metadata: ${metadataResponse.status}`);
        const text = await metadataResponse.text();
        console.error(`Response: ${text.substring(0, 300)}`);
        return;
      }

      const metadata = await metadataResponse.json();
      console.log(`✅ Metadata fetched successfully`);
      console.log(`\n📝 Metadata:`);
      console.log(`  Name: ${metadata.name}`);
      console.log(`  Image: ${metadata.image}`);
      console.log(`  Image URL type: ${metadata.image?.startsWith('http') ? 'HTTP ✅' : metadata.image?.startsWith('ipfs://') ? 'IPFS ❌' : 'UNKNOWN ❌'}`);

      // Check image accessibility
      if (metadata.image) {
        console.log(`\n🖼️  Checking image accessibility...`);
        try {
          const imageResponse = await fetch(metadata.image, { method: 'HEAD' });
          console.log(`  Image URL: ${metadata.image}`);
          console.log(`  Status: ${imageResponse.status} ${imageResponse.ok ? '✅ Accessible' : '❌ Not accessible'}`);
          console.log(`  Content-Type: ${imageResponse.headers.get('content-type')}`);
        } catch (error) {
          console.error(`  ❌ Image fetch error: ${error.message}`);
        }
      }
    } catch (error) {
      console.error(`❌ Error fetching metadata: ${error.message}`);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Check tokens 7, 8, 9, 10
for (let i = 7; i <= 10; i++) {
  await checkToken(i);
}
