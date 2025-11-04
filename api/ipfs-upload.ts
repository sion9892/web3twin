const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY;
export const PINATA_GATEWAY = process.env.PINATA_GATEWAY || 'https://gateway.pinata.cloud/ipfs/';

export async function uploadToIPFS(data: string | Blob, fileName: string, contentType?: string): Promise<string> {
  if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
    console.error('Pinata API keys not configured');
    throw new Error('Pinata API keys not configured');
  }

  // Use form-data package for Node.js compatibility
  const FormDataLib = (await import('form-data')).default;
  const formData = new FormDataLib();
  
  if (typeof data === 'string') {
    const Buffer = (await import('buffer')).Buffer;
    const buffer = Buffer.from(data, 'utf-8');
    formData.append('file', buffer, {
      filename: fileName,
      contentType: contentType || (fileName.endsWith('.svg') ? 'image/svg+xml' : 'application/json'),
    });
  } else {
    // Convert Blob to Buffer if needed
    const Buffer = (await import('buffer')).Buffer;
    const arrayBuffer = await data.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    formData.append('file', buffer, {
      filename: fileName,
      contentType: contentType || (fileName.endsWith('.svg') ? 'image/svg+xml' : 'application/json'),
    });
  }

  // Pinata options
  const pinataMetadata = JSON.stringify({
    name: fileName,
  });

  formData.append('pinataMetadata', pinataMetadata);

  const pinataOptions = JSON.stringify({
    cidVersion: 1,
  });

  formData.append('pinataOptions', pinataOptions);

  try {
    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_KEY,
        ...formData.getHeaders(),
      },
      body: formData as any,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Pinata API error:', response.status, errorText);
      throw new Error(`Pinata upload failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    const ipfsHash = result.IpfsHash;
    
    if (!ipfsHash) {
      console.error('Pinata response missing IpfsHash:', result);
      throw new Error('Pinata upload failed: No IPFS hash returned');
    }
    
    return `ipfs://${ipfsHash}`;
  } catch (error: any) {
    console.error('IPFS upload error:', error);
    throw error;
  }
}

export async function uploadJSONToIPFS(json: any, fileName: string): Promise<string> {
  const jsonString = JSON.stringify(json);
  return uploadToIPFS(jsonString, fileName);
}

export async function uploadSVGToIPFS(svg: string, fileName: string): Promise<string> {
  return uploadToIPFS(svg, fileName, 'image/svg+xml');
}

