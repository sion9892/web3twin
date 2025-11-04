import type { VercelRequest, VercelResponse } from '@vercel/node';
import { uploadJSONToIPFS, uploadSVGToIPFS } from './ipfs-upload';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { svg, metadata } = req.body;

    if (!svg || !metadata) {
      return res.status(400).json({ error: 'Missing svg or metadata' });
    }

    // Upload SVG to IPFS
    console.log('📤 Uploading SVG to IPFS...');
    const svgIpfsUrl = await uploadSVGToIPFS(svg, `nft-${Date.now()}.svg`);
    console.log('✅ SVG uploaded:', svgIpfsUrl);

    // Replace image field in metadata with IPFS URL
    const metadataWithIPFS = {
      ...metadata,
      image: svgIpfsUrl,
    };

    // Upload metadata to IPFS
    console.log('📤 Uploading metadata to IPFS...');
    const metadataIpfsUrl = await uploadJSONToIPFS(metadataWithIPFS, `nft-metadata-${Date.now()}.json`);
    console.log('✅ Metadata uploaded:', metadataIpfsUrl);

    return res.status(200).json({
      svgIpfsUrl,
      metadataIpfsUrl,
      imageUrl: svgIpfsUrl.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/'),
      metadataUrl: metadataIpfsUrl.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/'),
    });
  } catch (error: any) {
    console.error('Error uploading to IPFS:', error);
    return res.status(500).json({
      error: 'Failed to upload to IPFS',
      message: error.message,
    });
  }
}

