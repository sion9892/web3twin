import { useState, useEffect } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { findBestTwin, type TokenizedData, type SimilarityResult, type CastData } from '../lib/similarity';
import { useMintNFT } from '../hooks/useMintNFT';
import { useUserNFTs } from '../hooks/useUserNFTs';
import { handleBlockchainError, type Web3TwinError } from '../lib/errorHandler';
import NFTGallery from './NFTGallery';
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
  const { mintNFT, isPending, isConfirming, isConfirmed } = useMintNFT();
  const { refetchTokens } = useUserNFTs();
  const [result, setResult] = useState<SimilarityResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [minting, setMinting] = useState(false);
  const [mintError, setMintError] = useState<string | null>(null);
  const [mintingStep, setMintingStep] = useState<string>('');
  const [showGallery, setShowGallery] = useState(true);

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
      return;
    }
    
    console.log('Starting NFT mint...', { address, result });
    console.log('Current chain ID:', chainId);
    setMinting(true);
    setMintError(null);
    setMintingStep('🔍 Preparing transaction...');
    
    try {
      // Check if connected to correct network (Base Sepolia testnet)
      if (chainId !== 84532) {
        console.error('Wrong network! Expected Base Sepolia (84532), got:', chainId);
        setMintError('Please connect to Base Sepolia network (Chain ID: 84532)');
        setMinting(false);
        setMintingStep('');
        return;
      }
      
      setMintingStep('📝 Step 1/6: Generating NFT metadata from similarity data...');
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setMintingStep('⚙️ Step 2/6: Setting up smart contract parameters...');
      await new Promise(resolve => setTimeout(resolve, 600));
      
      setMintingStep('🔗 Step 3/6: Connecting to Base Sepolia blockchain...');
      await new Promise(resolve => setTimeout(resolve, 700));
      
      setMintingStep('📊 Step 4/6: Preparing transaction data (similarity: ' + result.similarity.toFixed(1) + '%)...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For demo purposes, we'll use the current user's address as both users
      // In a real app, you'd need the twin's wallet address
      console.log('Calling mintNFT...');
      setMintingStep('📤 Step 5/6: Sending transaction to smart contract...');
      
      // Add timeout for minting
      const mintPromise = mintNFT(address, address, result, userInfo.username);
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Minting timeout after 30 seconds')), 30000);
      });
      
      await Promise.race([mintPromise, timeoutPromise]);
      console.log('mintNFT call completed');
      
      // Wait for transaction confirmation, then refresh NFT list
      // The useWaitForTransactionReceipt hook will handle the confirmation
    } catch (err) {
      console.error('Error in handleMintNFT:', err);
      const appError = handleBlockchainError(err, 'mintNFT');
      setMintError(appError.message);
      setMinting(false);
      setMintingStep('');
    }
  };

  // Handle transaction states and update minting step
  useEffect(() => {
    console.log('Transaction status:', { isConfirmed, minting, isPending, isConfirming });
    
    if (isPending && minting) {
      setMintingStep('💳 Step 6/6: Waiting for wallet confirmation... Please check your wallet!');
    } else if (isConfirming && minting) {
      setMintingStep('⏳ Final Step: Confirming transaction on Base Sepolia blockchain... This may take a few seconds.');
    } else if (isConfirmed && minting) {
      setMintingStep('✅ Success! NFT minted successfully! Refreshing your collection...');
      console.log('Transaction confirmed, refreshing NFT list...');
      // Transaction confirmed, refresh NFT list and show gallery
      refetchTokens();
      setShowGallery(true);
      setMinting(false);
      setMintingStep('');
    }
  }, [isConfirmed, minting, isPending, isConfirming, refetchTokens]);

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

            {result.sharedEmojis.length > 0 && (
              <div className="signal-card">
                <h4 className="signal-title">Shared Emojis</h4>
                <div className="signal-items">
                  {result.sharedEmojis.map((emoji, idx) => (
                    <span key={idx} className="signal-tag emoji">
                      {emoji}
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
                {minting || isPending || isConfirming 
                  ? '😺 Adopting Your Twin Cat...' 
                  : isConfirmed 
                  ? '🎉 Twin Cat Adopted! 😻' 
                  : '🐱 Adopt Your Twin Cat NFT ✨'
                }
              </button>
              
              {(minting || isPending || isConfirming) && (
                <div className="minting-status">
                  <div className="spinner" />
                  <p className="minting-step-text">
                    {mintingStep || (
                      minting ? 'Preparing transaction...' : 
                      isPending ? 'Waiting for wallet confirmation...' : 
                      isConfirming ? 'Confirming transaction...' : ''
                    )}
                  </p>
                  <div className="minting-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{
                        width: isPending ? '40%' : isConfirming ? '80%' : isConfirmed ? '100%' : '20%'
                      }} />
                    </div>
                    <div className="progress-steps">
                      <span className={minting && !isPending ? 'active' : ''}>Prepare</span>
                      <span className={isPending ? 'active' : ''}>Approve</span>
                      <span className={isConfirming ? 'active' : ''}>Confirm</span>
                      <span className={isConfirmed ? 'active' : ''}>Complete</span>
                    </div>
                  </div>
                </div>
              )}
              {mintError && (
                <div className="error-message">
                  {mintError}
                  {mintError.includes('Base Sepolia network') && (
                    <div style={{ marginTop: '1rem' }}>
                      <p>지갑에서 Base Sepolia 네트워크로 변경해주세요:</p>
                      <ul style={{ textAlign: 'left', marginTop: '0.5rem' }}>
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

        {/* NFT Gallery */}
        {isConnected && (
          <div className="nft-section">
            <div className="section-header">
              <h3>Your Web3Twin NFTs</h3>
              <button 
                onClick={() => setShowGallery(!showGallery)}
                className="toggle-button"
              >
                {showGallery ? 'Hide NFTs' : 'Show NFTs'}
              </button>
            </div>
            
            {showGallery && <NFTGallery />}
          </div>
        )}
      </div>
    </div>
  );
}

