import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useUserNFTs, useNFTDetails, type UserNFT } from '../hooks/useUserNFTs';
import TransferNFT from './TransferNFT';

export default function NFTGallery() {
  const { address, isConnected } = useAccount();
  const { tokenIds, isLoadingTokens, refetchTokens } = useUserNFTs();
  const [nfts, setNfts] = useState<UserNFT[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tokenIds && tokenIds.length > 0) {
      loadNFTDetails();
    } else {
      setNfts([]);
    }
  }, [tokenIds]);

  const loadNFTDetails = async () => {
    if (!tokenIds) return;
    
    setLoading(true);
    const nftDetails: UserNFT[] = [];
    
    for (const tokenIdBigInt of tokenIds) {
      const tokenId = Number(tokenIdBigInt);
      try {
        // Here we would normally fetch the NFT details
        // For now, we'll create a mock NFT
        nftDetails.push({
          tokenId,
          twinMatch: {
            user1: address || '',
            user2: '0x...',
            similarity: 85.5,
            timestamp: Date.now(),
            sharedHashtags: 'web3, crypto, nft',
            sharedEmojis: '🎭 🚀 ✨',
          },
          tokenURI: `https://web3twin.vercel.app/api/metadata/${tokenId}`,
        });
      } catch (error) {
        console.error(`Error loading NFT ${tokenId}:`, error);
      }
    }
    
    setNfts(nftDetails);
    setLoading(false);
  };

  if (!isConnected) {
    return (
      <div className="nft-gallery">
        <div className="gallery-placeholder">
          <div className="cat-placeholder">🐱</div>
          <h3>Connect your wallet to view your Twin Cats</h3>
          <p>Your adorable cat NFTs are waiting!</p>
        </div>
      </div>
    );
  }

  if (isLoadingTokens || loading) {
    return (
      <div className="nft-gallery">
        <div className="gallery-loading">
          <div className="spinner-cat">😺</div>
          <p>Loading your Twin Cats...</p>
        </div>
      </div>
    );
  }

  if (!tokenIds || tokenIds.length === 0) {
    return (
      <div className="nft-gallery">
        <div className="gallery-empty">
          <div className="empty-cat">😿</div>
          <h3>No Twin Cats found</h3>
          <p>Mint your first Twin Cat NFT to start your collection! 🐱✨</p>
        </div>
      </div>
    );
  }

  return (
    <div className="nft-gallery">
      <div className="gallery-header">
        <h3>🐱 Your Twin Cat Collection ✨</h3>
        <button onClick={() => refetchTokens()} className="refresh-button">
          🔄 Refresh
        </button>
      </div>
      
      <div className="nft-grid">
        {nfts.map((nft) => (
          <div key={nft.tokenId} className="nft-card cat-card">
            <div className="nft-image">
              <div className="nft-placeholder cat-nft-placeholder">
                🐱✨
              </div>
              <div className="nft-badge">#{nft.tokenId}</div>
            </div>
            
            <div className="nft-info">
              <h4>Twin Cat #{nft.tokenId}</h4>
              <div className="nft-details">
                <div className="detail-row">
                  <span>😻 Purrfection:</span>
                  <span className="similarity-badge">{nft.twinMatch.similarity}%</span>
                </div>
                <div className="detail-row">
                  <span>📅 Adopted:</span>
                  <span>{new Date(nft.twinMatch.timestamp).toLocaleDateString()}</span>
                </div>
                <div className="detail-row">
                  <span>🏷️ Shared Tags:</span>
                  <span className="tags-text">{nft.twinMatch.sharedHashtags}</span>
                </div>
                <div className="detail-row">
                  <span>✨ Vibes:</span>
                  <span>{nft.twinMatch.sharedEmojis}</span>
                </div>
              </div>
              
              <div className="nft-actions">
                <TransferNFT 
                  tokenId={nft.tokenId}
                  onTransferComplete={() => {
                    refetchTokens();
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
