import { useState, useEffect } from 'react';
import { findBestTwin, type TokenizedData, type SimilarityResult, type CastData } from '../lib/similarity';
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
  const [result, setResult] = useState<SimilarityResult | null>(null);
  const [loading, setLoading] = useState(true);

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

  const shareText = `I just found my Web3Twin on Farcaster! 🎭\n\n@${userInfo.username} ↔️ @${result.username}\n${result.similarity.toFixed(1)}% similarity\n\nFind yours at web3twin.vercel.app`;

  return (
    <div className="step-container">
      <div className="step-content">
        <h2 className="step-title">Meet Your Twin! 🎭</h2>

        <div className="twin-card">
          <div className="twin-header">
            <div className="twin-avatars">
              <div className="avatar-wrapper">
                <span className="avatar-label">You</span>
              </div>
              <div className="twin-connector">
                <svg className="connector-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </div>
              <div className="avatar-wrapper">
                <img 
                  src={result.pfpUrl} 
                  alt={result.displayName}
                  className="avatar-image"
                />
                <span className="avatar-label">Twin</span>
              </div>
            </div>

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
      </div>
    </div>
  );
}

