import { useState, useEffect } from 'react';
import {
  getFollowers,
  getFollowing,
  getRecentCasts,
  mergeAndDedupeCandidates,
  sampleCandidates,
  extractKeywords,
  type UserInfo,
  type FollowerData,
} from '../lib/neynar';
import { preprocessCasts, type CastData, type TokenizedData } from '../lib/similarity';

interface Step2PreviewProps {
  userInfo: UserInfo;
  onComplete: (
    userCasts: CastData[],
    userTokens: TokenizedData,
    candidates: Array<{
      info: FollowerData;
      casts: CastData[];
      tokens: TokenizedData;
    }>
  ) => void;
}

const SAMPLE_SIZE = 40; // Number of candidates to analyze
const CAST_LIMIT = 25; // Number of recent casts per user

export default function Step2Preview({ userInfo, onComplete }: Step2PreviewProps) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<string>('Loading your casts...');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [userCasts, setUserCasts] = useState<CastData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Step 1: Load user's casts
      setStage('Loading your recent casts...');
      setProgress(10);
      
      const casts = await getRecentCasts(userInfo.fid, CAST_LIMIT);
      if (casts.length === 0) {
        setError('No casts found for this user. Please try a different handle.');
        return;
      }
      
      setUserCasts(casts);
      const keywords = extractKeywords(casts, 10);
      setKeywords(keywords);
      setProgress(25);

      // Step 2: Try to load followers and following first
      setStage('Loading your network...');
      const [followers, following] = await Promise.all([
        getFollowers(userInfo.fid, 100),
        getFollowing(userInfo.fid, 100),
      ]);
      setProgress(40);

      // Step 3: Merge and sample candidates
      setStage('Selecting candidates...');
      let allCandidates = mergeAndDedupeCandidates(followers, following);
      
      // If no network candidates, fallback to top users
      if (allCandidates.length === 0) {
        setStage('Using popular users as candidates...');
        const topUsers = [
          { fid: 3, username: 'dwr', display_name: 'Dan Romero', pfp_url: 'https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/3f5d69fd-e7b0-4a7e-8a8b-0c8c8c8c8c8c/avatar' },
          { fid: 5650, username: 'vitalik', display_name: 'Vitalik Buterin', pfp_url: 'https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/5650/avatar' },
          { fid: 2, username: 'v', display_name: 'V', pfp_url: 'https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/2/avatar' },
          { fid: 1, username: 'farcaster', display_name: 'Farcaster', pfp_url: 'https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/1/avatar' },
          { fid: 4, username: 'varunsrin', display_name: 'Varun Srinivasan', pfp_url: 'https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/4/avatar' },
          { fid: 5, username: 'jessepollak', display_name: 'Jesse Pollak', pfp_url: 'https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/5/avatar' },
          { fid: 6, username: 'a16z', display_name: 'a16z', pfp_url: 'https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/6/avatar' },
          { fid: 7, username: 'coinbase', display_name: 'Coinbase', pfp_url: 'https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/7/avatar' },
          { fid: 8, username: 'paradigm', display_name: 'Paradigm', pfp_url: 'https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/8/avatar' },
          { fid: 9, username: 'uniswap', display_name: 'Uniswap', pfp_url: 'https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/9/avatar' },
          { fid: 10, username: 'balajis', display_name: 'Balaji', pfp_url: 'https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/10/avatar' },
          { fid: 11, username: 'elonmusk', display_name: 'Elon Musk', pfp_url: 'https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/11/avatar' },
          { fid: 12, username: 'naval', display_name: 'Naval', pfp_url: 'https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/12/avatar' },
          { fid: 13, username: 'marc', display_name: 'Marc Andreessen', pfp_url: 'https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/13/avatar' },
          { fid: 14, username: 'cdixon', display_name: 'Chris Dixon', pfp_url: 'https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/14/avatar' },
          { fid: 15, username: 'sama', display_name: 'Sam Altman', pfp_url: 'https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/15/avatar' },
          { fid: 16, username: 'gavin', display_name: 'Gavin Wood', pfp_url: 'https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/16/avatar' },
          { fid: 17, username: 'vbuterin', display_name: 'Vitalik Buterin', pfp_url: 'https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/17/avatar' },
          { fid: 18, username: 'cz_binance', display_name: 'CZ', pfp_url: 'https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/18/avatar' },
          { fid: 19, username: 'brian_armstrong', display_name: 'Brian Armstrong', pfp_url: 'https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/19/avatar' },
          { fid: 20, username: 'justinsuntron', display_name: 'Justin Sun', pfp_url: 'https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/20/avatar' },
        ];
        
        // Remove current user from candidates
        allCandidates = topUsers.filter(user => user.fid !== userInfo.fid);
        
        if (allCandidates.length === 0) {
          setError('No candidates available. Please try a different handle.');
          return;
        }
      }

      const sampledCandidates = sampleCandidates(allCandidates, SAMPLE_SIZE);
      setProgress(50);

      // Step 4: Fetch casts for each candidate
      setStage(`Analyzing ${sampledCandidates.length} candidates...`);
      const candidatesWithData: Array<{
        info: FollowerData;
        casts: CastData[];
        tokens: TokenizedData;
      }> = [];
      
      for (let i = 0; i < sampledCandidates.length; i++) {
        const candidate = sampledCandidates[i];
        const candidateCasts = await getRecentCasts(candidate.fid, CAST_LIMIT);
        
        if (candidateCasts.length > 0) {
          const tokens = preprocessCasts(candidateCasts);
          candidatesWithData.push({
            info: candidate,
            casts: candidateCasts,
            tokens,
          });
        }
        
        // Update progress
        setProgress(50 + ((i + 1) / sampledCandidates.length) * 45);
      }

      setProgress(100);
      setStage('Analysis complete!');

      // Preprocess user casts
      const userTokens = preprocessCasts(casts);

      // Wait a moment to show completion
      setTimeout(() => {
        onComplete(casts, userTokens, candidatesWithData);
      }, 500);

    } catch (err) {
      console.error('Error loading data:', err);
      setError('An error occurred while analyzing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="step-container">
      <div className="step-content">
        <h2 className="step-title">Analyzing Your Vibe</h2>
        
        {loading ? (
          <>
            <div className="progress-container">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="progress-text">{Math.round(progress)}%</p>
            </div>
            
            <p className="stage-text">{stage}</p>

            <div className="loading-animation">
              <div className="spinner" />
            </div>
          </>
        ) : error ? (
          <div className="error-container">
            <div className="error-message">{error}</div>
            <button 
              onClick={() => window.location.reload()} 
              className="secondary-button"
            >
              Try Again
            </button>
          </div>
        ) : null}

        {keywords.length > 0 && (
          <div className="keywords-preview">
            <h3 className="keywords-title">Your Top Keywords:</h3>
            <div className="keywords-grid">
              {keywords.map((keyword, idx) => (
                <span key={idx} className="keyword-tag">
                  {keyword}
                </span>
              ))}
            </div>
            <p className="keywords-info">
              Found {userCasts.length} recent casts to analyze
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

