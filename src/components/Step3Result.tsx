import { useState, useEffect } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { findBestTwin, type TokenizedData, type SimilarityResult, type CastData } from '../lib/similarity';
import { useMintNFT } from '../hooks/useMintNFT';
import { useUserNFTs } from '../hooks/useUserNFTs';
import type { FollowerData } from '../lib/neynar';
import { generateNFTSVG } from '../lib/generateNFTSVG';
import NFTSuccessModal from './NFTSuccessModal';

interface Step3ResultProps {
  userInfo: { username: string; fid: number; pfp_url?: string };
  userTokens: TokenizedData;
  candidates: Array<{
    info: FollowerData;
    casts: CastData[];
    tokens: TokenizedData;
  }>;
  onShare: (result: SimilarityResult, hash?: string) => void;
  onReset: () => void;
}

export default function Step3Result({
  userInfo,
  userTokens,
  candidates,
  onShare,
  onReset,
}: Step3ResultProps) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { mintNFT, isPending, isConfirming, isConfirmed, hash, error: mintContractError, mintedTokenId } = useMintNFT();
  const { tokenIds, refetchTokens } = useUserNFTs();
  const [result, setResult] = useState<SimilarityResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [minting, setMinting] = useState(false);
  const [showNFTModal, setShowNFTModal] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    calculateMatch();
  }, []);

  const calculateMatch = () => {
    setLoading(true);
    
    // Check if self-match (only one candidate and it's the user themselves)
    const isSelfMatch = candidates.length === 1 && candidates[0].info.fid === userInfo.fid;
    
    if (isSelfMatch) {
      // Hardcode 100% for self-match
      const selfMatch: SimilarityResult = {
        fid: userInfo.fid,
        username: userInfo.username,
        displayName: (userInfo as any).display_name || userInfo.username,
        pfpUrl: userInfo.pfp_url || '',
        similarity: 100,
        textJaccard: 1.0,
        hashtagOverlap: 1.0,
        emojiOverlap: 1.0,
        sharedHashtags: [],
        sharedEmojis: [],
      };
      setResult(selfMatch);
      setLoading(false);
      return;
    }
    
    // Prepare candidates in the format expected by findBestTwin
    const formattedCandidates = candidates.map(c => ({
      tokens: c.tokens,
      info: {
        fid: c.info.fid,
        username: c.info.username,
        displayName: c.info.display_name,
        // pfp 객체를 우선적으로 활용 (pfp?.url → pfp_url 순서)
        pfpUrl: (c.info.pfp?.url || c.info.pfp_url || '').trim(),
      },
    }));

    // Debug: Log candidate info to check pfp_url and pfp object
    console.log('🔍 Checking candidates for pfp:', formattedCandidates.map(c => ({
      username: c.info.username,
      pfpUrl: c.info.pfpUrl,
      hasPfpUrl: !!c.info.pfpUrl && c.info.pfpUrl.trim() !== '',
      pfpObject: candidates.find(cand => cand.info.username === c.info.username)?.info.pfp,
    })));

    const bestMatch = findBestTwin(userTokens, formattedCandidates);
    
    // Debug: Log the best match result
    if (bestMatch) {
      console.log('✅ Best match found:', {
        username: bestMatch.username,
        pfpUrl: bestMatch.pfpUrl,
        hasPfpUrl: !!bestMatch.pfpUrl && bestMatch.pfpUrl.trim() !== '',
        pfpUrlLength: bestMatch.pfpUrl?.length || 0,
        pfpUrlType: typeof bestMatch.pfpUrl,
        pfpUrlValue: bestMatch.pfpUrl
      });
      
      // Check the original candidate's pfp data
      const originalCandidate = candidates.find(c => c.info.username === bestMatch.username);
      if (originalCandidate) {
        console.log('🔍 Original candidate pfp data:', {
          pfp_url: originalCandidate.info.pfp_url,
          pfp: originalCandidate.info.pfp,
          pfp_url_type: typeof originalCandidate.info.pfp_url,
          pfp_url_length: originalCandidate.info.pfp_url?.length || 0,
          pfp_object: originalCandidate.info.pfp,
          hasPfpObject: !!originalCandidate.info.pfp
        });
      }
    }
    
    setResult(bestMatch);
    setLoading(false);
  };

  const handleMintNFT = async () => {
    if (!result || !address) {
      console.error('Missing result or address:', { result, address });
      alert('Missing required information. Please try again.');
      return;
    }
    
    console.log('🚀 Starting NFT mint...', { address, result, userInfo });
    console.log('Current chain ID:', chainId);
    setMinting(true);
    setHasError(false);
    
    try {
      // Check if connected to correct network (Base mainnet)
      if (chainId !== 8453) {
        const errorMsg = `Please switch to Base network. Current network: ${chainId}, Required: 8453`;
        console.error('❌ Wrong network!', errorMsg);
        alert(errorMsg);
        setMinting(false);
        setHasError(true);
        return;
      }
      
      console.log('✅ Network check passed: Base');
      
      // Check Pinata credentials
      const pinataJWT = import.meta.env.VITE_PINATA_JWT;
      const pinataApiKey = import.meta.env.VITE_PINATA_API_KEY;
      const pinataSecretKey = import.meta.env.VITE_PINATA_SECRET_KEY;
      
      // 디버깅: 환경 변수 확인
      console.log('🔍 Pinata Environment Variables:', {
        hasJWT: !!pinataJWT,
        hasApiKey: !!pinataApiKey,
        hasSecretKey: !!pinataSecretKey,
        jwtLength: pinataJWT?.length || 0,
        allEnvVars: Object.keys(import.meta.env).filter(key => key.includes('PINATA')),
      });
      
      if (!pinataJWT && (!pinataApiKey || !pinataSecretKey)) {
        const errorMsg = `Pinata API credentials are not configured.\n\nPlease check:\n1. Vercel Environment Variables에 VITE_PINATA_JWT가 설정되어 있는지 확인\n2. 재배포 후 브라우저 캐시를 클리어하세요 (Cmd+Shift+R 또는 Ctrl+Shift+R)\n3. Vercel 대시보드에서 환경 변수가 Production, Preview, Development 모두에 설정되어 있는지 확인`;
        console.error('❌ Pinata credentials missing:', {
          pinataJWT: pinataJWT ? 'SET (hidden)' : 'NOT SET',
          pinataApiKey: pinataApiKey ? 'SET (hidden)' : 'NOT SET',
          pinataSecretKey: pinataSecretKey ? 'SET (hidden)' : 'NOT SET',
        });
        alert(errorMsg);
        setMinting(false);
        setHasError(true);
        return;
      }
      
      console.log('✅ Pinata credentials check passed');
      
      // Mint the NFT
      console.log('📝 Calling mintNFT with params:', {
        user1: address,
        user2: address,
        similarity: result.similarity,
        hashtags: result.sharedHashtags,
        username: userInfo.username
      });
      
      await mintNFT(address, address, result, userInfo.username, userInfo.pfp_url);
      console.log('✅ mintNFT call completed successfully');
      
    } catch (err: any) {
      console.error('❌ Error in handleMintNFT:', err);
      console.error('Error type:', typeof err);
      console.error('Error message:', err?.message);
      console.error('Error code:', err?.code);
      console.error('Full error:', JSON.stringify(err, null, 2));
      
      // Show user-friendly error message
      let errorMessage = 'Failed to mint NFT. ';
      if (err?.message) {
        if (err.message.includes('Pinata')) {
          errorMessage += 'IPFS upload failed. Please check your Pinata API credentials.';
        } else if (err.message.includes('user rejected') || err.code === 4001) {
          errorMessage += 'Transaction was rejected.';
        } else if (err.message.includes('insufficient funds')) {
          errorMessage += 'Insufficient funds for gas.';
        } else {
          errorMessage += err.message;
        }
      } else {
        errorMessage += 'Please try again later.';
      }
      
      alert(errorMessage);
      setMinting(false);
      setHasError(true);
    }
  };

  // Handle transaction confirmation
  useEffect(() => {
    console.log('Transaction status:', { isConfirmed, minting, isPending, isConfirming, hash, mintedTokenId });
    
    if (isConfirmed && minting) {
      console.log('✅ Transaction confirmed!');
      console.log('📋 Transaction hash:', hash);
      console.log('🆔 Minted Token ID:', mintedTokenId || tokenIds?.[tokenIds.length - 1]);
      console.log('🔗 View on Basescan:', hash ? `https://basescan.org/tx/${hash}` : 'N/A');
      refetchTokens();
      setShowNFTModal(true);
      setMinting(false);
      
    }
  }, [isConfirmed, minting, isPending, isConfirming, refetchTokens, mintedTokenId, address, hash, tokenIds]);

  // Handle contract errors
  useEffect(() => {
    if (mintContractError && minting) {
      console.error('❌ Contract error detected:', mintContractError);
      
      let errorMessage = 'Contract error occurred. ';
      if (mintContractError.message) {
        errorMessage += mintContractError.message;
      } else {
        errorMessage += 'Please try again later.';
      }
      
      alert(errorMessage);
      setMinting(false);
      setHasError(true);
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
        </div>
      </div>
    );
  }

  // Check if result is self-match (no network found)
  const isSelfMatch = result.fid === userInfo.fid;

  return (
    <div className="step-container">
      <div className="step-content">
        <h2 className="step-title">Meet Your Twin!</h2>

        <div className="twin-card">
          <div className="twin-header">
            <div className="twin-info">
              <h3 className="twin-name">{result.displayName}</h3>
              <p className="twin-username">@{result.username}</p>
              {!isSelfMatch && (
                <a
                  href={`https://warpcast.com/${result.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    marginTop: '0.5rem',
                    fontSize: '0.875rem',
                    color: '#8b5cf6',
                    textDecoration: 'none',
                    padding: '0.375rem 0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#8b5cf6';
                    e.currentTarget.style.backgroundColor = '#f5f3ff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  View Your Twin on Farcaster
                </a>
              )}
              {isSelfMatch && (
                <div style={{
                  marginTop: '1.5rem',
                  padding: '1.25rem 1.5rem',
                  background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                  border: '2px solid #fbbf24',
                  borderRadius: '0.75rem',
                  color: '#92400e',
                  boxShadow: '0 4px 6px rgba(251, 191, 36, 0.1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '-10px',
                    width: '60px',
                    height: '60px',
                    background: 'rgba(251, 191, 36, 0.2)',
                    borderRadius: '50%',
                    zIndex: 0
                  }} />
                  <p style={{ 
                    margin: 0, 
                    fontSize: '0.9375rem', 
                    fontWeight: '600',
                    lineHeight: '1.6',
                    position: 'relative',
                    zIndex: 1
                  }}>
                    💡 Try mentioning more people in your casts!<br />
                    <span style={{ fontWeight: '400', fontSize: '0.875rem' }}>
                      You'll be able to find your twin.
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* NFT Design Display */}
          <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '400px', height: '400px', border: '2px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden' }}>
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
            <p style={{ 
              marginTop: '0.5rem', 
              fontSize: '0.875rem', 
              color: '#6b7280',
              textAlign: 'center'
            }}>
              This is your NFT design
            </p>
          </div>
        </div>

        <div className="action-buttons">
          <button 
            onClick={async () => {
              if (!isConnected || !address) {
                // 지갑이 연결되지 않은 경우, 연결을 유도할 수 있지만 여기서는 단순히 에러 표시
                alert('Please connect your wallet first to mint NFT.');
                return;
              }
              
              if (isConfirmed) {
                // 이미 mint된 경우 모달만 열기 (추가 fee 없음)
                // 최신 tokenId를 가져오기 위해 refetch
                await refetchTokens();
                setShowNFTModal(true);
              } else {
                // 아직 mint하지 않은 경우 mint 실행
                handleMintNFT();
              }
            }}
            className="primary-button cat-mint-button"
            disabled={minting || isPending || isConfirming}
          >
            {isPending 
              ? '💳 Check Your Wallet...' 
              : isConfirming 
              ? '⏳ Confirming...' 
              : isConfirmed 
              ? '🎉 Starry Night NFT Minted! ✨' 
              : 'Get Your Starry Night NFT'
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
          
          {hasError && (
            <div style={{ 
              padding: '1rem', 
              background: '#fee2e2', 
              borderRadius: '8px', 
              fontSize: '1rem',
              textAlign: 'center',
              border: '1px solid #fca5a5',
              color: '#991b1b',
              marginTop: '1rem'
            }}>
              <p style={{ margin: 0 }}>
                An error occurred. Please try again later.
              </p>
            </div>
          )}
          
          {isConnected && address && (
            <div className="info-card">
              <p>
                <strong>💰 Minting Cost</strong>
                <br />
                Base Smart Wallet을 사용하면 첫 3회까지는 무료로 민팅할 수 있습니다.
                <br />
                이후에는 약 $0.001-$0.01의 낮은 가스비가 발생할 수 있습니다.
                <br />
                <small>💡 Base는 Ethereum Layer 2 네트워크로 가스비가 매우 저렴합니다.</small>
              </p>
            </div>
          )}
          
          {!isConnected && (
            <div className="info-card">
              <p>
                <strong>🔗 Connect Your Wallet</strong>
                <br />
                Please connect your wallet to mint your NFT. Base Smart Wallet is recommended for the best experience.
              </p>
            </div>
          )}
          
          <button 
            onClick={() => onShare(result, hash)}
            style={{
              backgroundColor: 'white',
              color: '#8b5cf6',
              border: '1px solid #e5e7eb',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#8b5cf6';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.color = '#8b5cf6';
            }}
          >
            Share as Cast →
          </button>
          
          <button onClick={onReset} className="link-button">
            Find Another Twin
          </button>
        </div>

        {/* NFT Success Modal */}
        <NFTSuccessModal
          isOpen={showNFTModal}
          onClose={() => setShowNFTModal(false)}
          mintedTokenId={
            mintedTokenId ?? 
            (tokenIds && tokenIds.length > 0 
              ? Number(tokenIds[tokenIds.length - 1])
              : null)
          }
          address={address}
          result={result}
          userInfo={userInfo}
          transactionHash={hash}
        />

      </div>
    </div>
  );
}

