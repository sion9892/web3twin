import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import process from 'process';
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';
import { buildTwinMatchMetadata } from '../lib/twinMetadata';

const DEFAULT_CONTRACT_ADDRESS = '0x2C4C60cfF5CB69B3Cb6BEd2f28fFBDd7F8987706';
const DEFAULT_IPFS_IMAGE_CID =
  'QmXTAJc96BuZ4dtX2BMiUiGeQy73AYbBXMn6yaRCcLQHaq';

const CONTRACT_ADDRESS =
  (process.env.NFT_CONTRACT_ADDRESS as `0x${string}` | undefined) ||
  (DEFAULT_CONTRACT_ADDRESS as `0x${string}`);
const IPFS_IMAGE_CID = process.env.IPFS_IMAGE_CID ?? DEFAULT_IPFS_IMAGE_CID;
const RPC_URL = process.env.BASE_RPC_URL ?? process.env.RPC_URL;

const metadataOutputDir =
  process.env.METADATA_OUTPUT_DIR ??
  path.resolve(process.cwd(), 'metadata', 'ipfs');

const tokenIdArgs = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
const overwrite = process.argv.includes('--overwrite');

if (tokenIdArgs.length === 0) {
  console.error(
    'Usage: pnpm ts-node scripts/metadata-generator.ts <tokenId...> [--overwrite]',
  );
  process.exit(1);
}

const tokenIds = tokenIdArgs
  .map((id) => parseInt(id, 10))
  .filter((id) => !Number.isNaN(id) && id >= 0);

if (tokenIds.length === 0) {
  console.error('No valid tokenIds provided');
  process.exit(1);
}

const transport = RPC_URL ? http(RPC_URL) : http();

const publicClient = createPublicClient({
  chain: base,
  transport,
});

async function ensureOutputDir(dir: string) {
  await mkdir(dir, { recursive: true });
}

async function fetchTwinMatch(tokenId: number) {
  try {
    await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: [
        {
          inputs: [{ name: '_tokenId', type: 'uint256' }],
          name: 'ownerOf',
          outputs: [{ name: '', type: 'address' }],
          stateMutability: 'view',
          type: 'function',
        },
      ],
      functionName: 'ownerOf',
      args: [BigInt(tokenId)],
    });
  } catch (error) {
    throw new Error(`Token ${tokenId} not minted or unavailable: ${String(error)}`);
  }

  const [twinMatch] = await publicClient.multicall({
    contracts: [
      {
        address: CONTRACT_ADDRESS,
        abi: [
          {
            inputs: [{ name: '_tokenId', type: 'uint256' }],
            name: 'getTwinMatch',
            outputs: [
              {
                components: [
                  { name: 'user1', type: 'address' },
                  { name: 'user2', type: 'address' },
                  { name: 'similarity', type: 'uint256' },
                  { name: 'timestamp', type: 'uint256' },
                  { name: 'sharedHashtags', type: 'string' },
                  { name: 'sharedEmojis', type: 'string' },
                ],
                name: '',
                type: 'tuple',
              },
            ],
            stateMutability: 'view',
            type: 'function',
          },
        ],
        functionName: 'getTwinMatch',
        args: [BigInt(tokenId)],
      },
    ],
    allowFailure: false,
  });

  if (!twinMatch) {
    throw new Error(`Twin match data missing for token ${tokenId}`);
  }

  return twinMatch;
}

async function writeMetadataFile(tokenId: number, metadata: unknown) {
  const filePath = path.join(metadataOutputDir, `${tokenId}.json`);

  if (!overwrite) {
    try {
      await writeFile(filePath, JSON.stringify(metadata, null, 2), {
        flag: 'wx',
      });
      return filePath;
    } catch (error: any) {
      if (error?.code === 'EEXIST') {
        throw new Error(
          `Metadata file for token ${tokenId} already exists. Use --overwrite to replace it.`,
        );
      }
      throw error;
    }
  }

  await writeFile(filePath, JSON.stringify(metadata, null, 2));
  return filePath;
}

async function main() {
  await ensureOutputDir(metadataOutputDir);

  for (const tokenId of tokenIds) {
    try {
      const twinMatch = await fetchTwinMatch(tokenId);

      const metadata = buildTwinMatchMetadata({
        tokenId,
        similarity: twinMatch.similarity,
        sharedHashtags: twinMatch.sharedHashtags,
        ipfsImageCid: IPFS_IMAGE_CID,
      });

      const filePath = await writeMetadataFile(tokenId, metadata);
      console.log(`✅ Metadata written: ${filePath}`);
    } catch (error) {
      console.error(`❌ Failed for token ${tokenId}:`, error);
    }
  }
}

main().catch((error) => {
  console.error('Unexpected error during metadata generation:', error);
  process.exit(1);
});

