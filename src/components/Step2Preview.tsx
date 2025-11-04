import { useState, useEffect } from 'react';
import {
  getRecentCasts,
  getUserByUsername,
  sampleCandidates,
  extractKeywords,
  extractMentionsFromCasts,
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

      // Step 2: Extract mentions from casts
      setStage('Extracting mentions from your casts...');
      const mentionedUsernames = extractMentionsFromCasts(casts);
      
      // Filter out current user's username
      const filteredMentions = mentionedUsernames.filter(
        username => username.toLowerCase() !== userInfo.username.toLowerCase()
      );
      
      // Fetch user info for mentioned usernames
      let allCandidates: FollowerData[] = [];
      if (filteredMentions.length > 0) {
        for (const username of filteredMentions.slice(0, 50)) { // Limit to 50 mentions
          try {
            const mentionedUser = await getUserByUsername(username);
            if (mentionedUser && mentionedUser.fid && typeof mentionedUser.fid === 'number' && mentionedUser.fid > 0 && mentionedUser.fid !== userInfo.fid) {
              allCandidates.push({
                fid: mentionedUser.fid,
                username: mentionedUser.username,
                display_name: mentionedUser.display_name,
                pfp_url: mentionedUser.pfp_url || '',
              });
            }
            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 50));
          } catch (err) {
            console.warn(`Failed to fetch user ${username}:`, err);
          }
        }
      }
      
      setProgress(40);
      
      // Step 3: If no mentions found, use self as twin
      const isSelfMatchCase = allCandidates.length === 0;
      if (isSelfMatchCase) {
        setStage('No mentions found, creating self-match...');
        allCandidates = [{
          fid: userInfo.fid,
          username: userInfo.username,
          display_name: userInfo.display_name || userInfo.username,
          pfp_url: userInfo.pfp_url || '',
        }];
      }

      const sampledCandidates = sampleCandidates(allCandidates, SAMPLE_SIZE);
      setProgress(50);

      console.log('🔍 Candidates:', {
        totalMentions: filteredMentions.length,
        validCandidates: allCandidates.length,
        sampled: sampledCandidates.length,
        isSelfMatch: isSelfMatchCase
      });

      // Step 4: Fetch casts for each candidate
      setStage(`Analyzing ${sampledCandidates.length} candidates...`);
      const candidatesWithData: Array<{
        info: FollowerData;
        casts: CastData[];
        tokens: TokenizedData;
      }> = [];
      
      // If self-match case, use existing casts and tokens (skip API call)
      if (isSelfMatchCase && sampledCandidates.length === 1 && sampledCandidates[0].fid === userInfo.fid) {
        console.log('🔍 Self-match case: using existing casts and tokens');
        const userTokens = preprocessCasts(casts);
        candidatesWithData.push({
          info: sampledCandidates[0],
          casts: casts,
          tokens: userTokens,
        });
        setProgress(95);
      } else {
        // Normal case: fetch casts for each candidate
        for (let i = 0; i < sampledCandidates.length; i++) {
          const candidate = sampledCandidates[i];
          
          try {
            const candidateCasts = await getRecentCasts(candidate.fid, CAST_LIMIT);
            
            if (candidateCasts.length > 0) {
              const tokens = preprocessCasts(candidateCasts);
              candidatesWithData.push({
                info: candidate,
                casts: candidateCasts,
                tokens,
              });
            }
          } catch (err: any) {
            // Rate limit 에러는 전체 프로세스 중단
            if (err?.message?.includes('rate limit')) {
              throw err;
            }
            // 다른 에러는 해당 candidate만 스킵
            console.warn(`Failed to fetch casts for ${candidate.username}:`, err);
          }
          
          // Rate limit 방지를 위한 delay (API 호출 사이에 100ms 대기)
          if (i < sampledCandidates.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          
          // Update progress
          setProgress(50 + ((i + 1) / sampledCandidates.length) * 45);
        }
      }

      setProgress(100);
      setStage('Analysis complete!');

      // Preprocess user casts
      const userTokens = preprocessCasts(casts);

      // Wait a moment to show completion
      setTimeout(() => {
        onComplete(casts, userTokens, candidatesWithData);
      }, 500);

    } catch (err: any) {
      console.error('Error loading data:', err);
      if (err?.message?.includes('rate limit')) {
        setError('API rate limit exceeded. Please wait a few moments and try again.');
      } else {
        setError('An error occurred while analyzing. Please try again.');
      }
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