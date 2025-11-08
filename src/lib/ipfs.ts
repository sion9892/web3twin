// Pinata REST API 사용 (추가 패키지 설치 불필요)
const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY || '';
const PINATA_SECRET_KEY = import.meta.env.VITE_PINATA_SECRET_KEY || '';
const PINATA_JWT = import.meta.env.VITE_PINATA_JWT || '';

/**
 * SVG를 IPFS에 업로드하고 CID를 반환 (Pinata REST API 사용)
 */
export async function uploadSVGToIPFS(svg: string, filename: string): Promise<string> {
  if (!PINATA_JWT && (!PINATA_API_KEY || !PINATA_SECRET_KEY)) {
    throw new Error('Pinata credentials are not set. Please set VITE_PINATA_JWT (recommended) or VITE_PINATA_API_KEY and VITE_PINATA_SECRET_KEY in your .env file');
  }

  // SVG를 Blob으로 변환
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const file = new File([blob], filename, { type: 'image/svg+xml' });
  
  // FormData 생성
  const formData = new FormData();
  formData.append('file', file);
  
  // Pinata 메타데이터 추가
  const pinataMetadata = JSON.stringify({
    name: filename,
  });
  formData.append('pinataMetadata', pinataMetadata);
  
  // Pinata 옵션 추가
  const pinataOptions = JSON.stringify({
    cidVersion: 0,
  });
  formData.append('pinataOptions', pinataOptions);
  
  // Pinata REST API 호출
  const headers: Record<string, string> = {};
  if (PINATA_JWT) {
    headers['Authorization'] = `Bearer ${PINATA_JWT}`;
  } else {
    headers['pinata_api_key'] = PINATA_API_KEY;
    headers['pinata_secret_api_key'] = PINATA_SECRET_KEY;
  }
  
  const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers,
    body: formData,
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to upload to Pinata: ${response.status} ${error}`);
  }
  
  const result = await response.json();
  
  // IPFS URL 반환
  return `ipfs://${result.IpfsHash}`;
}

/**
 * 메타데이터를 IPFS에 업로드하고 CID를 반환 (Pinata REST API 사용)
 */
export async function uploadMetadataToIPFS(metadata: any): Promise<string> {
  if (!PINATA_JWT && (!PINATA_API_KEY || !PINATA_SECRET_KEY)) {
    throw new Error('Pinata credentials are not set. Please set VITE_PINATA_JWT (recommended) or VITE_PINATA_API_KEY and VITE_PINATA_SECRET_KEY in your .env file');
  }

  // Pinata에 메타데이터 업로드
  const body = {
    pinataContent: metadata,
    pinataMetadata: {
      name: 'metadata.json',
    },
    pinataOptions: {
      cidVersion: 0,
    },
  };
  
  // Pinata REST API 호출
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (PINATA_JWT) {
    headers['Authorization'] = `Bearer ${PINATA_JWT}`;
  } else {
    headers['pinata_api_key'] = PINATA_API_KEY;
    headers['pinata_secret_api_key'] = PINATA_SECRET_KEY;
  }
  
  const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to upload metadata to Pinata: ${response.status} ${error}`);
  }
  
  const result = await response.json();
  
  // IPFS URL 반환
  return `ipfs://${result.IpfsHash}`;
}

/**
 * IPFS URL을 HTTP 게이트웨이 URL로 변환
 */
export function ipfsToHttp(ipfsUrl: string): string {
  if (ipfsUrl.startsWith('ipfs://')) {
    const cid = ipfsUrl.replace('ipfs://', '');
    // 여러 게이트웨이 옵션 제공 (첫 번째가 실패하면 다른 것을 시도할 수 있음)
    return `https://ipfs.io/ipfs/${cid}`;
  }
  return ipfsUrl;
}

