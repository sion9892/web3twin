import type { UserInfo } from '../lib/neynar';
import type { SimilarityResult } from '../lib/similarity';

interface Step4ShareProps {
  userInfo: UserInfo;
  result: SimilarityResult;
  transactionHash?: string;
  onReset: () => void;
}

export default function Step4Share({
  userInfo,
  result,
  transactionHash,
  onReset,
}: Step4ShareProps) {
  const getShareText = () => {
    let text = `I just found my Web3Twin on Farcaster! \n\n@${userInfo.username} ↔️ @${result.username}\n${result.similarity.toFixed(1)}% similarity`;
    
    if (transactionHash) {
      text += `\nOur NFT address is on Basescan: https://basescan.org/tx/${transactionHash}`;
    }
    
    text += `\n\nFind yours at web3twin.vercel.app`;
    
    return encodeURIComponent(text);
  };

  const getWarpcastShareUrl = () => {
    const text = getShareText();
    return `https://warpcast.com/~/compose?text=${text}`;
  };

  return (
    <div className="step-container">
      <div className="step-content">
        <h2 className="step-title">Share Your Twin Match! 🎉</h2>

        <div className="share-summary">
          <div className="summary-card">
            <div className="summary-row">
              <span className="summary-label">Your Handle:</span>
              <span className="summary-value">@{userInfo.username}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Your Twin:</span>
              <span className="summary-value">@{result.username}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Match:</span>
              <span className="summary-value">{result.similarity.toFixed(1)}%</span>
            </div>
            <div className="summary-row summary-sub-row">
              <span className="summary-label">Text Similarity:</span>
              <span className="summary-value">{(result.textJaccard * 100).toFixed(1)}%</span>
            </div>
            <div className="summary-row summary-sub-row">
              <span className="summary-label">Hashtag Overlap:</span>
              <span className="summary-value">{(result.hashtagOverlap * 100).toFixed(1)}%</span>
            </div>
            <div className="summary-row summary-sub-row">
              <span className="summary-label">Emoji Overlap:</span>
              <span className="summary-value">{(result.emojiOverlap * 100).toFixed(1)}%</span>
            </div>
            {result.sharedHashtags.length > 0 && (
              <div className="summary-row">
                <span className="summary-label">Shared Hashtags:</span>
                <span className="summary-value">
                  {result.sharedHashtags.join(', ')}
                </span>
              </div>
            )}
          </div>

          <div className="share-actions">
            <a
              href={getWarpcastShareUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="primary-button"
            >
              Cast on Farcaster
            </a>
            <button
              onClick={() => {
                navigator.clipboard.writeText(decodeURIComponent(getShareText()));
                alert('Share text copied to clipboard!');
              }}
              className="secondary-button"
            >
              Copy Share Text
            </button>
            <button onClick={onReset} className="link-button">
              Find Another Twin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

