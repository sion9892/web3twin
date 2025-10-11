import { CastData } from './similarity';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
const NEYNAR_API_KEY = import.meta.env.VITE_NEYNAR_API_KEY || '';
const USE_DIRECT_API = import.meta.env.DEV; // 개발 모드에서는 직접 호출

export interface UserInfo {
  fid: number;
  username: string;
  display_name: string;
  pfp_url: string;
  follower_count: number;
  following_count: number;
}

export interface FollowerData {
  fid: number;
  username: string;
  display_name: string;
  pfp_url: string;
}

/**
 * Convert Farcaster handle to FID
 */
export async function getUserByUsername(username: string): Promise<UserInfo | null> {
  try {
    const cleanUsername = username.replace('@', '');
    
    // 개발 환경에서는 직접 Neynar API 호출
    if (USE_DIRECT_API && NEYNAR_API_KEY) {
      const response = await fetch(
        `https://api.neynar.com/v2/farcaster/user/by_username?username=${cleanUsername}`,
        {
          headers: {
            'accept': 'application/json',
            'api_key': NEYNAR_API_KEY,
          },
        }
      );
      
      if (!response.ok) {
        console.error('Failed to fetch user:', await response.text());
        return null;
      }
      
      const data = await response.json();
      console.log('User API response:', data); // 디버깅용
      
      const user = {
        fid: data.user?.fid || data.result?.user?.fid,
        username: data.user?.username || data.result?.user?.username,
        display_name: data.user?.display_name || data.result?.user?.display_name,
        pfp_url: data.user?.pfp_url || data.result?.user?.pfp_url,
        follower_count: data.user?.follower_count || data.result?.user?.follower_count,
        following_count: data.user?.following_count || data.result?.user?.following_count,
      };
      
      console.log('Parsed user:', user); // 디버깅용
      return user;
    }
    
    // 프로덕션에서는 프록시 사용
    const response = await fetch(`${API_BASE}/api/neynar-proxy?endpoint=user&username=${cleanUsername}`);
    
    if (!response.ok) {
      console.error('Failed to fetch user:', await response.text());
      return null;
    }
    
    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

/**
 * Get followers list for a given FID
 */
export async function getFollowers(fid: number, limit: number = 100): Promise<FollowerData[]> {
  try {
    if (USE_DIRECT_API && NEYNAR_API_KEY) {
      const response = await fetch(
        `https://api.neynar.com/v2/farcaster/followers?fid=${fid}&limit=${limit}`,
        {
          headers: {
            'accept': 'application/json',
            'api_key': NEYNAR_API_KEY,
          },
        }
      );
      
      if (!response.ok) {
        console.error('Failed to fetch followers:', await response.text());
        return [];
      }
      
      const data = await response.json();
      return data.result?.users?.map((user: any) => ({
        fid: user.fid,
        username: user.username,
        display_name: user.display_name,
        pfp_url: user.pfp_url,
      })) || [];
    }
    
    const response = await fetch(`${API_BASE}/api/neynar-proxy?endpoint=followers&fid=${fid}&limit=${limit}`);
    
    if (!response.ok) {
      console.error('Failed to fetch followers:', await response.text());
      return [];
    }
    
    const data = await response.json();
    return data.users || [];
  } catch (error) {
    console.error('Error fetching followers:', error);
    return [];
  }
}

/**
 * Get following list for a given FID
 */
export async function getFollowing(fid: number, limit: number = 100): Promise<FollowerData[]> {
  try {
    if (USE_DIRECT_API && NEYNAR_API_KEY) {
      const response = await fetch(
        `https://api.neynar.com/v2/farcaster/following?fid=${fid}&limit=${limit}`,
        {
          headers: {
            'accept': 'application/json',
            'api_key': NEYNAR_API_KEY,
          },
        }
      );
      
      if (!response.ok) {
        console.error('Failed to fetch following:', await response.text());
        return [];
      }
      
      const data = await response.json();
      return data.result?.users?.map((user: any) => ({
        fid: user.fid,
        username: user.username,
        display_name: user.display_name,
        pfp_url: user.pfp_url,
      })) || [];
    }
    
    const response = await fetch(`${API_BASE}/api/neynar-proxy?endpoint=following&fid=${fid}&limit=${limit}`);
    
    if (!response.ok) {
      console.error('Failed to fetch following:', await response.text());
      return [];
    }
    
    const data = await response.json();
    return data.users || [];
  } catch (error) {
    console.error('Error fetching following:', error);
    return [];
  }
}

/**
 * Get recent casts for a given FID
 */
export async function getRecentCasts(fid: number, limit: number = 25): Promise<CastData[]> {
  try {
    if (USE_DIRECT_API && NEYNAR_API_KEY) {
      const response = await fetch(
        `https://api.neynar.com/v2/farcaster/feed/user/casts?fid=${fid}&limit=${limit}`,
        {
          headers: {
            'accept': 'application/json',
            'api_key': NEYNAR_API_KEY,
          },
        }
      );
      
      if (!response.ok) {
        console.error('Failed to fetch casts:', await response.text());
        return [];
      }
      
      const data = await response.json();
      console.log('Casts API response:', data); // 디버깅용
      return data.casts?.map((cast: any) => ({
        text: cast.text,
        author_fid: cast.author?.fid,
        hash: cast.hash,
        timestamp: cast.timestamp,
      })) || [];
    }
    
    const response = await fetch(`${API_BASE}/api/neynar-proxy?endpoint=casts&fid=${fid}&limit=${limit}`);
    
    if (!response.ok) {
      console.error('Failed to fetch casts:', await response.text());
      return [];
    }
    
    const data = await response.json();
    return data.casts || [];
  } catch (error) {
    console.error('Error fetching casts:', error);
    return [];
  }
}

/**
 * Merge and dedupe followers and following lists
 */
export function mergeAndDedupeCandidates(
  followers: FollowerData[],
  following: FollowerData[]
): FollowerData[] {
  const uniqueMap = new Map<number, FollowerData>();
  
  [...followers, ...following].forEach(user => {
    if (!uniqueMap.has(user.fid)) {
      uniqueMap.set(user.fid, user);
    }
  });
  
  return Array.from(uniqueMap.values());
}

/**
 * Randomly sample K candidates from the candidate pool
 */
export function sampleCandidates(candidates: FollowerData[], k: number): FollowerData[] {
  if (candidates.length <= k) return candidates;
  
  // Fisher-Yates shuffle and take first k
  const shuffled = [...candidates];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled.slice(0, k);
}

/**
 * Extract keywords from casts for preview
 */
export function extractKeywords(casts: CastData[], topN: number = 10): string[] {
  const wordFreq = new Map<string, number>();
  
  casts.forEach(cast => {
    const words = cast.text
      .toLowerCase()
      .replace(/https?:\/\/[^\s]+/g, '')
      .replace(/@[\w]+/g, '')
      .replace(/#[\w]+/g, '')
      .split(/[\s.,!?;:()\[\]{}'"]+/)
      .filter(word => word.length > 3);
    
    words.forEach(word => {
      wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
    });
  });
  
  // Sort by frequency and return top N
  return Array.from(wordFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([word]) => word);
}

