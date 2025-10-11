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

      // Step 2: Load followers and following
      setStage('Loading your network...');
      const [followers, following] = await Promise.all([
        getFollowers(userInfo.fid, 150),
        getFollowing(userInfo.fid, 150),
      ]);
      setProgress(40);

      // Step 3: Merge and sample candidates
      setStage('Selecting candidates...');
      const allCandidates = mergeAndDedupeCandidates(followers, following);
      
      if (allCandidates.length === 0) {
        setError('No candidates found in your network. Please try a different handle.');
        return;
      }

      const sampledCandidates = sampleCandidates(allCandidates, SAMPLE_SIZE);
      setProgress(50);

      // Step 4: Fetch casts for each candidate
      setStage(`Analyzing ${sampledCandidates.length} candidates...`);
      const candidatesWithData = [];
      
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

