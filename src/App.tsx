import { useState } from 'react';
import CustomWalletButton from './components/CustomWalletButton';
import Step1Handle from './components/Step1Handle';
import Step2Preview from './components/Step2Preview';
import Step3Result from './components/Step3Result';
import Step4Share from './components/Step4Share';
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
  transactionHash: string | undefined;
}

function App() {
  const [state, setState] = useState<AppState>({
    currentStep: 1,
    userInfo: null,
    userCasts: [],
    userTokens: null,
    candidates: [],
    result: null,
    transactionHash: undefined,
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

  const handleShare = (result: SimilarityResult, hash?: string) => {
    setState(prev => ({
      ...prev,
      currentStep: 4,
      result,
      transactionHash: hash,
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
      transactionHash: undefined,
    });
  };


  return (
    <div className="app">
      <nav className="navbar">
        <div className="navbar-content">
          <h1 className="navbar-title">Web3Twin</h1>
          <CustomWalletButton />
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
          />
        )}

        {state.currentStep === 4 && state.result && state.userInfo && (
          <Step4Share
            userInfo={state.userInfo}
            result={state.result}
            transactionHash={state.transactionHash}
            onReset={handleReset}
          />
        )}
      </main>

      <footer className="footer">
        <p>Built with Neynar API • Find your Farcaster twin based on your cast vibes</p>
      </footer>
    </div>
  );
}

export default App;

