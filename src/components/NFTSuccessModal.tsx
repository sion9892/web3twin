import { generateNFTSVG } from '../lib/generateNFTSVG';
import type { SimilarityResult } from '../lib/similarity';
import { CONTRACT_ADDRESS } from '../lib/wagmi';

interface NFTSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  mintedTokenId: number | null;
  address: string | undefined;
  result: SimilarityResult | null;
  userInfo: { username: string; fid: number; pfp_url?: string };
}

export default function NFTSuccessModal({
  isOpen,
  onClose,
  mintedTokenId,
  address,
  result,
  userInfo,
}: NFTSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content nft-modal" onClick={(e) => e.stopPropagation()}>
        <button 
          className="modal-close"
          onClick={onClose}
        >
          ✕
        </button>
        
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.8rem' }}>
          🎉 Starry Night NFT Minted! ✨
        </h2>
        
        {/* NFT Design Preview */}
        {result && (
          <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '400px', height: '400px', border: '2px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: generateNFTSVG({
                    user1Username: userInfo.username,
                    user2Username: result.username,
                    user1PfpUrl: userInfo.pfp_url,
                    user2PfpUrl: result.pfpUrl,
                    similarity: result.similarity,
                    textJaccard: result.textJaccard,
                    hashtagOverlap: result.hashtagOverlap,
                    emojiOverlap: result.emojiOverlap,
                  })
                }}
              />
            </div>
          </div>
        )}
        
        <div className="nft-preview">
          <div style={{ 
            background: '#f3f4f6',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem'
          }}>
            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
              ✅ Your Starry Night NFT has been minted on Base!
            </p>
            <p style={{ fontSize: '0.85rem', color: '#999', marginBottom: '0.5rem' }}>
              You can now view it on blockchain explorers.
            </p>
            <p style={{ fontSize: '0.8rem', color: '#999' }}>
              💡 <strong>Note:</strong> If the NFT doesn't appear in Base App, it may take a few minutes for indexing. 
              You can also check on{' '}
              <a 
                href={`https://basescan.org/address/${address}#tokentxnsErc721`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#8b5cf6', textDecoration: 'underline' }}
              >
                Basescan
              </a>
              {' '}to verify the NFT exists.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
            {mintedTokenId && address && (
              <>
                <a
                  href={`https://basescan.org/token/${CONTRACT_ADDRESS.base}?a=${mintedTokenId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="primary-button"
                  style={{ backgroundColor: '#10b981' }}
                >
                  📱 View NFT on Basescan
                </a>
              </>
            )}
            
            <button 
              onClick={onClose}
              className="secondary-button"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

