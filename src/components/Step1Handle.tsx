import { useState } from 'react';
import { getUserByUsername, type UserInfo } from '../lib/neynar';
import { validateHandle, handleApiError, type Web3TwinError } from '../lib/errorHandler';

interface Step1HandleProps {
  onComplete: (userInfo: UserInfo) => void;
}

export default function Step1Handle({ onComplete }: Step1HandleProps) {
  const [handle, setHandle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate handle
    const validationError = validateHandle(handle);
    if (validationError) {
      setError(validationError.message);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userInfo = await getUserByUsername(handle.trim());
      
      if (!userInfo) {
        setError('User not found. Please check the handle and try again.');
        return;
      }

      onComplete(userInfo);
    } catch (err) {
      const appError = handleApiError(err, 'getUserByUsername');
      setError(appError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="step-container">
      <div className="step-content">
        <h2 className="step-title">Find Your Web3 Twin</h2>
        <p className="step-description">
          Enter your Farcaster handle to analyze your recent casts and find users with a similar vibe.
        </p>

        <form onSubmit={handleSubmit} className="input-form">
          <div className="input-group">
            <span className="input-prefix">@</span>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="farcasterhandle"
              className="text-input"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="primary-button"
            disabled={loading || !handle.trim()}
          >
            {loading ? 'Analyzing...' : 'Start Analysis'}
          </button>
        </form>

        <div className="info-card">
          <svg className="info-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>
            We'll analyze your recent casts and compare them with your followers and following to find your perfect twin match!
          </p>
        </div>
      </div>
    </div>
  );
}

