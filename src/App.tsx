import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Step1Handle from './components/Step1Handle';
import Step2Preview from './components/Step2Preview';
import Step3Result from './components/Step3Result';
import type { UserInfo } from './lib/neynar';
import type { CastData, TokenizedData, SimilarityResult } from './lib/similarity';
import type { FollowerData } from './lib/neynar';

type Step = 1 | 2 | 3 | 4;

interface AppState {
  currentStep: Step;
  userInfo: UserInfo | null;
  userCasts: CastData[];
  userTokens: TokenizedData | null;
  candidates: Array<{
    info: FollowerData;
    casts: CastData[];
    tokens: TokenizedData;
  }>;
  result: SimilarityResult | null;
}

function App() {
  const [state, setState] = useState<AppState>({
    currentStep: 1,
    userInfo: null,
    userCasts: [],
    userTokens: null,
    candidates: [],
    result: null,
  });

  const handleStep1Complete = (userInfo: UserInfo) => {
    setState(prev => ({
      ...prev,
      currentStep: 2,
      userInfo,
    }));
  };

  const handleStep2Complete = (
    userCasts: CastData[],
    userTokens: TokenizedData,
    candidates: Array<{
      info: FollowerData;
      casts: CastData[];
      tokens: TokenizedData;
    }>
  ) => {
    setState(prev => ({
      ...prev,
      currentStep: 3,
      userCasts,
      userTokens,
      candidates,
    }));
  };

  const handleShare = (result: SimilarityResult) => {
    setState(prev => ({
      ...prev,
      currentStep: 4,
      result,
    }));
  };

  const handleReset = () => {
    setState({
      currentStep: 1,
      userInfo: null,
      userCasts: [],
      userTokens: null,
      candidates: [],
      result: null,
    });
  };

  const getShareText = () => {
    if (!state.result || !state.userInfo) return '';
    
    return encodeURIComponent(
      `I just found my Web3Twin on Farcaster! 🎭\n\n@${state.userInfo.username} ↔️ @${state.result.username}\n${state.result.similarity.toFixed(1)}% similarity\n\nFind yours at web3twin.vercel.app`
    );
  };

  const getWarpcastShareUrl = () => {
    const text = getShareText();
    return `https://warpcast.com/~/compose?text=${text}`;
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="navbar-content">
          <h1 className="navbar-title">Web3Twin</h1>
          <ConnectButton 
            showBalance={false}
            chainStatus="icon"
            accountStatus="address"
          />
        </div>
      </nav>

      <div className="step-nav">
        <div className="step-nav-content">
          {[1, 2, 3, 4].map((step) => (
            <button
              key={step}
              className={`step-nav-item ${
                state.currentStep === step
                  ? 'active'
                  : state.currentStep > step
                  ? 'completed'
                  : 'pending'
              }`}
              disabled={state.currentStep < step}
            >
              {step}
            </button>
          ))}
        </div>
      </div>

      <main className="main-content">
        {state.currentStep === 1 && (
          <Step1Handle onComplete={handleStep1Complete} />
        )}

        {state.currentStep === 2 && state.userInfo && (
          <Step2Preview
            userInfo={state.userInfo}
            onComplete={handleStep2Complete}
          />
        )}

        {state.currentStep === 3 && state.userInfo && state.userTokens && (
          <Step3Result
            userInfo={state.userInfo}
            userTokens={state.userTokens}
            candidates={state.candidates}
            onShare={handleShare}
            onFindAgain={handleReset}
          />
        )}

        {state.currentStep === 4 && state.result && state.userInfo && (
          <div className="step-container">
            <div className="step-content">
              <h2 className="step-title">Share Your Twin Match! 🎉</h2>

              <div className="share-summary">
                <div className="summary-card">
                  <div className="summary-row">
                    <span className="summary-label">Your Handle:</span>
                    <span className="summary-value">@{state.userInfo.username}</span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Your Twin:</span>
                    <span className="summary-value">@{state.result.username}</span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Similarity:</span>
                    <span className="summary-value">{state.result.similarity.toFixed(1)}%</span>
                  </div>
                  {state.result.sharedHashtags.length > 0 && (
                    <div className="summary-row">
                      <span className="summary-label">Shared Hashtags:</span>
                      <span className="summary-value">
                        {state.result.sharedHashtags.join(', ')}
                      </span>
                    </div>
                  )}
                  {state.result.sharedEmojis.length > 0 && (
                    <div className="summary-row">
                      <span className="summary-label">Shared Emojis:</span>
                      <span className="summary-value">
                        {state.result.sharedEmojis.join(' ')}
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
                    Cast on Warpcast
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
                  <button onClick={handleReset} className="link-button">
                    Find Another Twin
                  </button>
                </div>
              </div>

              <div className="info-card">
                <p>
                  Share your twin match on Farcaster and see if your friends can find their twins too!
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>Built with Neynar API • Find your Farcaster twin based on your cast vibes</p>
      </footer>
    </div>
  );
}

export default App;

