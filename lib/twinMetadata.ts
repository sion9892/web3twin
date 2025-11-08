export interface TwinMatchData {
  tokenId: number;
  similarity: bigint | number;
  sharedHashtags?: string;
  ipfsImageCid: string;
  imageExtension?: string;
  externalBaseUrl?: string;
}

export interface TwinMatchMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{ trait_type: string; value: string | number }>;
  external_url?: string;
}

export function buildTwinMatchMetadata({
  tokenId,
  similarity,
  sharedHashtags,
  ipfsImageCid,
  imageExtension = 'png',
  externalBaseUrl,
}: TwinMatchData): TwinMatchMetadata {
  const similarityNumber =
    typeof similarity === 'bigint' ? Number(similarity) : similarity;

  if (!Number.isFinite(similarityNumber)) {
    throw new Error('Similarity value must be a finite number');
  }

  const hashtags = sharedHashtags
    ? sharedHashtags
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

  const metadata: TwinMatchMetadata = {
    name: `Twin Match #${tokenId} - ${similarityNumber}% Match`,
    description: `✨ Starry Night Match Found! Two Farcaster users share a ${similarityNumber}% compatibility under the stars! They share ${hashtags.length} common interests${
      hashtags.length > 0 ? ': ' + hashtags.slice(0, 3).join(', ') : ''
    }. A beautiful connection in the night sky! ⭐`,
    image: `ipfs://${ipfsImageCid}/${tokenId}.${imageExtension}`,
    attributes: [
      {
        trait_type: 'Similarity Score',
        value: `${similarityNumber.toFixed(1)}%`,
      },
      {
        trait_type: 'Night Sky Mood',
        value:
          similarityNumber > 80
            ? 'Brilliant ✨'
            : similarityNumber > 60
            ? 'Starry 🌟'
            : 'Moonlit 🌙',
      },
      {
        trait_type: 'Shared Topics',
        value: hashtags.length,
      },
      {
        trait_type: 'Sky Color',
        value:
          similarityNumber > 80
            ? 'Starry Blue'
            : similarityNumber > 60
            ? 'Deep Blue'
            : 'Midnight Blue',
      },
    ],
  };

  if (externalBaseUrl) {
    metadata.external_url = `${externalBaseUrl}/twin/${tokenId}`;
  }

  return metadata;
}

