import { useState, useEffect } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { findBestTwin, type TokenizedData, type SimilarityResult, type CastData } from '../lib/similarity';
import { useMintNFT } from '../hooks/useMintNFT';
import { useUserNFTs } from '../hooks/useUserNFTs';
import { handleBlockchainError } from '../lib/errorHandler';
import type { FollowerData } from '../lib/neynar';

interface Step3ResultProps {
  userInfo: { username: string; fid: number };
  userTokens: TokenizedData;
  candidates: Array<{
    info: FollowerData;
    casts: CastData[];
    tokens: TokenizedData;
  }>;
  onShare: (result: SimilarityResult) => void;
  onFindAgain: () => void;
}

export default function Step3Result({
  userInfo,
  userTokens,
  candidates,
  onShare,
  onFindAgain,
}: Step3ResultProps) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { mintNFT, isPending, isConfirming, isConfirmed, hash, error: mintContractError } = useMintNFT();
  const { refetchTokens } = useUserNFTs();
  const [result, setResult] = useState<SimilarityResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [minting, setMinting] = useState(false);
  const [mintError, setMintError] = useState<string | null>(null);
  const [showNFTModal, setShowNFTModal] = useState(false);

  useEffect(() => {
    calculateMatch();
  }, []);

  const calculateMatch = () => {
    setLoading(true);
    
    // Prepare candidates in the format expected by findBestTwin
    const formattedCandidates = candidates.map(c => ({
      tokens: c.tokens,
      info: {
        fid: c.info.fid,
        username: c.info.username,
        displayName: c.info.display_name,
        pfpUrl: c.info.pfp_url,
      },
    }));

    const bestMatch = findBestTwin(userTokens, formattedCandidates);
    setResult(bestMatch);
    setLoading(false);
  };

  const handleMintNFT = async () => {
    if (!result || !address) {
      console.error('Missing result or address:', { result, address });
      setMintError('Missing required data. Please try again.');
      return;
    }
    
    console.log('🚀 Starting NFT mint...', { address, result, userInfo });
    console.log('Current chain ID:', chainId);
    setMinting(true);
    setMintError(null);
    
    try {
      // Check if connected to correct network (Base Sepolia testnet)
      if (chainId !== 84532) {
        console.error('❌ Wrong network! Expected Base Sepolia (84532), got:', chainId);
        setMintError(`Wrong network! Please switch to Base Sepolia (Chain ID: 84532). Current: ${chainId}`);
        setMinting(false);
        return;
      }
      
      console.log('✅ Network check passed: Base Sepolia');
      
      // Mint the NFT
      console.log('📝 Calling mintNFT with params:', {
        user1: address,
        user2: address,
        similarity: result.similarity,
        hashtags: result.sharedHashtags,
        username: userInfo.username
      });
      
      await mintNFT(address, address, result, userInfo.username);
      console.log('✅ mintNFT call completed successfully');
      
    } catch (err: any) {
      console.error('❌ Error in handleMintNFT:', err);
      console.error('Error type:', typeof err);
      console.error('Error message:', err?.message);
      console.error('Error code:', err?.code);
      console.error('Full error:', JSON.stringify(err, null, 2));
      
      const appError = handleBlockchainError(err, 'mintNFT');
      setMintError(`${appError.message}\n\nDetails: ${err?.message || 'Unknown error'}`);
      setMinting(false);
    }
  };

  // Handle transaction confirmation
  useEffect(() => {
    console.log('Transaction status:', { isConfirmed, minting, isPending, isConfirming });
    
    if (isConfirmed && minting) {
      console.log('✅ Transaction confirmed!');
      refetchTokens();
      setShowNFTModal(true);
      setMinting(false);
    }
  }, [isConfirmed, minting, isPending, isConfirming, refetchTokens]);

  // Handle contract errors
  useEffect(() => {
    if (mintContractError && minting) {
      console.error('❌ Contract error detected:', mintContractError);
      setMintError(`Transaction failed: ${mintContractError.message || 'Unknown error'}`);
      setMinting(false);
    }
  }, [mintContractError, minting]);

  if (loading) {
    return (
      <div className="step-container">
        <div className="step-content">
          <h2 className="step-title">Finding Your Twin...</h2>
          <div className="loading-animation">
            <div className="spinner" />
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="step-container">
        <div className="step-content">
          <h2 className="step-title">No Match Found</h2>
          <p className="error-message">
            We couldn't find a suitable match. Try again with a different handle.
          </p>
          <button onClick={onFindAgain} className="primary-button">
            Find Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="step-container">
      <div className="step-content">
        <h2 className="step-title">Meet Your Twin! 🎭</h2>

        <div className="twin-card">
          <div className="twin-header">
            <div className="twin-info">
              <h3 className="twin-name">{result.displayName}</h3>
              <p className="twin-username">@{result.username}</p>
            </div>
          </div>

          <div className="similarity-score">
            <div className="score-circle">
              <svg className="score-ring" viewBox="0 0 120 120">
                <circle 
                  cx="60" 
                  cy="60" 
                  r="54" 
                  fill="none" 
                  stroke="#e5e7eb" 
                  strokeWidth="12"
                />
                <circle 
                  cx="60" 
                  cy="60" 
                  r="54" 
                  fill="none" 
                  stroke="#8b5cf6" 
                  strokeWidth="12"
                  strokeDasharray={`${2 * Math.PI * 54}`}
                  strokeDashoffset={`${2 * Math.PI * 54 * (1 - result.similarity / 100)}`}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                />
              </svg>
              <div className="score-text">
                <span className="score-value">{result.similarity.toFixed(1)}%</span>
                <span className="score-label">Match</span>
              </div>
            </div>
          </div>

          <div className="signals-grid">
            {result.sharedHashtags.length > 0 && (
              <div className="signal-card">
                <h4 className="signal-title">Shared Hashtags</h4>
                <div className="signal-items">
                  {result.sharedHashtags.map((tag, idx) => (
                    <span key={idx} className="signal-tag hashtag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}


            {result.matchingGmStreak && (
              <div className="signal-card special">
                <h4 className="signal-title">✨ GM Vibes Match!</h4>
                <p className="signal-description">
                  You both spread good morning energy! 🌅
                </p>
              </div>
            )}
          </div>

          <div className="score-breakdown">
            <h4 className="breakdown-title">Match Breakdown</h4>
            <div className="breakdown-items">
              <div className="breakdown-item">
                <span className="breakdown-label">Text Similarity</span>
                <span className="breakdown-value">{(result.textJaccard * 100).toFixed(1)}%</span>
              </div>
              <div className="breakdown-item">
                <span className="breakdown-label">Hashtag Overlap</span>
                <span className="breakdown-value">{(result.hashtagOverlap * 100).toFixed(1)}%</span>
              </div>
              <div className="breakdown-item">
                <span className="breakdown-label">Emoji Overlap</span>
                <span className="breakdown-value">{(result.emojiOverlap * 100).toFixed(1)}%</span>
              </div>
              {result.gmBonus > 0 && (
                <div className="breakdown-item bonus">
                  <span className="breakdown-label">GM Bonus</span>
                  <span className="breakdown-value">+{(result.gmBonus * 100).toFixed(1)}%</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button 
            onClick={() => onShare(result)}
            className="primary-button"
          >
            Share as Cast
          </button>
          
          {isConnected && address && (
            <>
              <button 
                onClick={handleMintNFT}
                className="primary-button cat-mint-button"
                disabled={minting || isPending || isConfirming}
              >
                {isPending 
                  ? '💳 Check Your Wallet...' 
                  : isConfirming 
                  ? '⏳ Confirming...' 
                  : isConfirmed 
                  ? '🎉 Twin Cat Adopted! 😻' 
                  : '🐱 Adopt Your Twin Cat NFT ✨'
                }
              </button>
              
              {(isPending || isConfirming) && (
                <div className="minting-status">
                  <div className="spinner" />
                  <p className="minting-step-text">
                    {isPending && '💳 Waiting for wallet confirmation...'}
                    {isConfirming && '⏳ Confirming transaction on blockchain...'}
                  </p>
                </div>
              )}
              {mintError && (
                <div className="error-message" style={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>
                  <strong>❌ Error:</strong>
                  <div style={{ marginTop: '0.5rem', padding: '0.75rem', background: '#fee', borderRadius: '4px', fontSize: '0.9rem' }}>
                    {mintError}
                  </div>
                  {mintError.includes('Base Sepolia') && (
                    <div style={{ marginTop: '1rem', background: '#fef3c7', padding: '1rem', borderRadius: '8px' }}>
                      <p><strong>🔧 지갑에서 Base Sepolia 네트워크로 변경해주세요:</strong></p>
                      <ul style={{ textAlign: 'left', marginTop: '0.5rem', marginLeft: '1.5rem' }}>
                        <li>Network Name: Base Sepolia</li>
                        <li>RPC URL: https://sepolia.base.org</li>
                        <li>Chain ID: 84532</li>
                        <li>Currency Symbol: ETH</li>
                        <li>Block Explorer: https://sepolia.basescan.org</li>
                      </ul>
                      <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                        💡 Base Sepolia는 테스트넷으로 무료 ETH를 받을 수 있습니다.
                      </p>
                    </div>
                  )}
                  {mintError.includes('insufficient funds') && (
                    <div style={{ marginTop: '1rem', background: '#dbeafe', padding: '1rem', borderRadius: '8px' }}>
                      <p><strong>💰 가스비 부족:</strong></p>
                      <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                        지갑에 Base Sepolia ETH가 필요합니다. 
                        <a href="https://www.coinbase.com/faucets/base-ethereum-goerli-faucet" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline', marginLeft: '0.25rem' }}>
                          Faucet에서 받기 →
                        </a>
                      </p>
                    </div>
                  )}
                </div>
              )}
              <div className="info-card">
                <p>
                  <strong>💰 Low Cost Minting!</strong> Base 네트워크에서는 가스비가 매우 저렴합니다 (약 $0.001).
                  <br />
                  <small>💡 Base는 Ethereum Layer 2로 가스비가 100배 이상 저렴합니다.</small>
                </p>
              </div>
            </>
          )}
          
          <button 
            onClick={onFindAgain}
            className="secondary-button"
          >
            Find Again
          </button>
          <a
            href={`https://warpcast.com/${result.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="link-button"
          >
            View on Warpcast →
          </a>
        </div>

        {/* NFT Success Modal */}
        {showNFTModal && (
          <div className="modal-overlay" onClick={() => setShowNFTModal(false)}>
            <div className="modal-content nft-modal" onClick={(e) => e.stopPropagation()}>
              <button 
                className="modal-close"
                onClick={() => setShowNFTModal(false)}
              >
                ✕
              </button>
              
              <h2 style={{ marginBottom: '1.5rem', fontSize: '1.8rem' }}>
                🎉 Twin Cat NFT Minted! 😻
              </h2>
              
              <div className="nft-preview">
                <div style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  padding: '2rem',
                  borderRadius: '12px',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{ 
                    fontSize: '4rem',
                    textAlign: 'center',
                    marginBottom: '1rem'
                  }}>
                    🐱✨
                  </div>
                  
                  {/* Twin Names with styled separator */}
                  <div style={{ 
                    textAlign: 'center',
                    marginBottom: '1rem'
                  }}>
                    <div style={{
                      color: '#FFD700',
                      fontSize: '1.3rem',
                      fontWeight: 'bold',
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                      marginBottom: '0.5rem'
                    }}>
                      @{userInfo.username}
                    </div>
                    <div style={{
                      color: 'white',
                      fontSize: '1.8rem',
                      fontWeight: 'bold',
                      margin: '0.25rem 0'
                    }}>
                      ×
                    </div>
                    <div style={{
                      color: '#FF69B4',
                      fontSize: '1.3rem',
                      fontWeight: 'bold',
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                      marginTop: '0.5rem'
                    }}>
                      @{result.username}
                    </div>
                  </div>
                  
                  <div style={{ 
                    color: 'white',
                    textAlign: 'center',
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    marginTop: '1rem',
                    textShadow: '0 2px 8px rgba(0,0,0,0.4)'
                  }}>
                    {result.similarity.toFixed(1)}% Match
                  </div>
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ marginBottom: '0.5rem', color: '#666' }}>
                    <strong>Transaction Hash:</strong>
                  </p>
                  <a
                    href={`https://sepolia.basescan.org/tx/${hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ 
                      fontSize: '0.9rem',
                      wordBreak: 'break-all',
                      color: '#8b5cf6',
                      textDecoration: 'underline'
                    }}
                  >
                    {hash}
                  </a>
                </div>
                
                <div style={{ 
                  background: '#f3f4f6',
                  padding: '1rem',
                  borderRadius: '8px',
                  marginBottom: '1rem'
                }}>
                  <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                    ✅ Your Twin Cat NFT has been minted on Base Sepolia!
                  </p>
                  <p style={{ fontSize: '0.85rem', color: '#999' }}>
                    You can now transfer it or view it on blockchain explorers.
                  </p>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                  <a
                    href={`https://sepolia.basescan.org/tx/${hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="primary-button"
                  >
                    🔍 View on Basescan
                  </a>
                  
                  <button 
                    onClick={() => setShowNFTModal(false)}
                    className="primary-button"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

