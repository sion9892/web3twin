import { CastData } from './similarity';

// 프로덕션에서는 상대 경로 사용, 개발 모드에서는 환경 변수 또는 빈 문자열
const API_BASE = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? '' : '');
const NEYNAR_API_KEY = import.meta.env.VITE_NEYNAR_API_KEY || '';
const USE_DIRECT_API = import.meta.env.DEV && !!NEYNAR_API_KEY; // 개발 모드이고 API 키가 있을 때만 직접 호출

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
  pfp?: { url?: string; [key: string]: any }; // pfp 객체 (선택적)
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
      
      // Validate that user has required fid
      if (!user.fid || typeof user.fid !== 'number' || user.fid <= 0) {
        console.warn(`Invalid user data for ${cleanUsername}:`, user);
        return null;
      }
      
      console.log('Parsed user:', user); // 디버깅용
      return user;
    }
    
    // 프로덕션에서는 프록시 사용 (상대 경로 사용)
    const proxyUrl = API_BASE 
      ? `${API_BASE}/api/neynar-proxy?endpoint=user&username=${cleanUsername}`
      : `/api/neynar-proxy?endpoint=user&username=${cleanUsername}`;
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      console.error('Failed to fetch user:', await response.text());
      return null;
    }
    
    const data = await response.json();
    const user = data.user;
    
    // Validate that user has required fid
    if (!user || !user.fid || typeof user.fid !== 'number' || user.fid <= 0) {
      console.warn(`Invalid user data for ${cleanUsername}:`, user);
      return null;
    }
    
    return user;
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
        const errorText = await response.text();
        console.error('Failed to fetch followers:', response.status, errorText);
        if (response.status === 429) {
          console.error('⚠️ Rate limit exceeded! Please wait a moment and try again.');
          throw new Error('API rate limit exceeded. Please try again in a few moments.');
        }
        if (response.status === 402) {
          console.warn('⚠️ Followers endpoint requires paid plan. Falling back to mentions from casts.');
        }
        return [];
      }
      
      const data = await response.json();
      console.log('🔍 Followers API full response:', JSON.stringify(data, null, 2)); // 전체 응답 확인
      console.log('🔍 Followers API response sample:', data.result?.users?.[0]); // 디버깅용
      
      // 첫 번째 사용자의 전체 객체 확인
      if (data.result?.users?.[0]) {
        const firstUser = data.result.users[0];
        console.log('🔍 First user full object:', JSON.stringify(firstUser, null, 2));
        console.log('🔍 First user pfp_url:', firstUser.pfp_url);
        console.log('🔍 First user pfp object:', firstUser.pfp);
        console.log('🔍 First user available keys:', Object.keys(firstUser));
        console.log('🔍 pfp object keys:', firstUser.pfp ? Object.keys(firstUser.pfp) : 'pfp object 없음');
      }
      
      return data.result?.users?.map((user: any) => {
        // pfp 객체를 우선적으로 활용 (pfp?.url → pfp_url → pfpUrl 순서)
        const pfpUrl = user.pfp?.url || user.pfp_url || user.pfpUrl || '';
        
        // pfp 객체 확인
        if (user.pfp) {
          console.log(`🔍 User ${user.username} has pfp object:`, JSON.stringify(user.pfp, null, 2));
          console.log(`🔍 Using pfp.url: ${user.pfp?.url || '없음'}`);
        }
        
        if (!pfpUrl) {
          console.warn(`⚠️ User ${user.username} has no pfp_url. Available fields:`, Object.keys(user));
          if (user.pfp) {
            console.warn(`⚠️ But has pfp object:`, user.pfp);
          }
        }
        
        return {
          fid: user.fid,
          username: user.username,
          display_name: user.display_name,
          pfp_url: pfpUrl,
          pfp: user.pfp, // pfp 객체 전체도 저장
        };
      }) || [];
    }
    
    const proxyUrl = API_BASE 
      ? `${API_BASE}/api/neynar-proxy?endpoint=followers&fid=${fid}&limit=${limit}`
      : `/api/neynar-proxy?endpoint=followers&fid=${fid}&limit=${limit}`;
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to fetch followers:', response.status, errorText);
      if (response.status === 402) {
        console.warn('⚠️ Followers endpoint requires paid plan. Falling back to mentions from casts.');
      }
      return [];
    }
    
    const data = await response.json();
    console.log('🔍 Followers Proxy full response:', JSON.stringify(data, null, 2)); // 전체 응답 확인
    console.log('🔍 Followers Proxy response sample:', data.users?.[0]); // 디버깅용
    // 프록시 응답의 구조를 확인하고 올바르게 매핑
    if (Array.isArray(data.users)) {
      return data.users.map((user: any) => {
        // pfp 객체를 우선적으로 활용
        const pfpUrl = user.pfp?.url || user.pfp_url || user.pfpUrl || '';
        console.log(`🔍 Proxy User ${user.username} pfp_url:`, pfpUrl, 'from:', { pfp_url: user.pfp_url, pfpUrl: user.pfpUrl, pfp: user.pfp });
        return {
          fid: user.fid,
          username: user.username,
          display_name: user.display_name || user.displayName,
          pfp_url: pfpUrl,
          pfp: user.pfp, // pfp 객체 전체도 저장
        };
      });
    }
    return [];
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
        const errorText = await response.text();
        console.error('Failed to fetch following:', response.status, errorText);
        if (response.status === 429) {
          console.error('⚠️ Rate limit exceeded! Please wait a moment and try again.');
          throw new Error('API rate limit exceeded. Please try again in a few moments.');
        }
        if (response.status === 402) {
          console.warn('⚠️ Following endpoint requires paid plan. Falling back to mentions from casts.');
        }
        return [];
      }
      
      const data = await response.json();
      console.log('🔍 Following API response sample:', data.result?.users?.[0]); // 디버깅용
      
      // 첫 번째 사용자의 pfp 객체 확인
      if (data.result?.users?.[0]) {
        const firstUser = data.result.users[0];
        console.log('🔍 First user pfp object:', firstUser.pfp);
        console.log('🔍 pfp object keys:', firstUser.pfp ? Object.keys(firstUser.pfp) : 'pfp object 없음');
      }
      
      return data.result?.users?.map((user: any) => {
        // pfp 객체를 우선적으로 활용
        const pfpUrl = user.pfp?.url || user.pfp_url || user.pfpUrl || '';
        
        // pfp 객체 확인
        if (user.pfp) {
          console.log(`🔍 User ${user.username} has pfp object:`, JSON.stringify(user.pfp, null, 2));
          console.log(`🔍 Using pfp.url: ${user.pfp?.url || '없음'}`);
        }
        
        console.log(`🔍 User ${user.username} pfp_url:`, pfpUrl, 'from:', { pfp_url: user.pfp_url, pfpUrl: user.pfpUrl, pfp: user.pfp });
        return {
          fid: user.fid,
          username: user.username,
          display_name: user.display_name,
          pfp_url: pfpUrl,
          pfp: user.pfp, // pfp 객체 전체도 저장
        };
      }) || [];
    }
    
    const proxyUrl = API_BASE 
      ? `${API_BASE}/api/neynar-proxy?endpoint=following&fid=${fid}&limit=${limit}`
      : `/api/neynar-proxy?endpoint=following&fid=${fid}&limit=${limit}`;
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to fetch following:', response.status, errorText);
      if (response.status === 402) {
        console.warn('⚠️ Following endpoint requires paid plan. Falling back to mentions from casts.');
      }
      return [];
    }
    
    const data = await response.json();
    console.log('🔍 Following Proxy response sample:', data.users?.[0]); // 디버깅용
    // 프록시 응답의 구조를 확인하고 올바르게 매핑
    if (Array.isArray(data.users)) {
      return data.users.map((user: any) => {
        // pfp 객체를 우선적으로 활용
        const pfpUrl = user.pfp?.url || user.pfp_url || user.pfpUrl || '';
        return {
          fid: user.fid,
          username: user.username,
          display_name: user.display_name || user.displayName,
          pfp_url: pfpUrl,
          pfp: user.pfp, // pfp 객체 전체도 저장
        };
      });
    }
    return [];
  } catch (error) {
    console.error('Error fetching following:', error);
    return [];
  }
}

/**
 * Get recent casts for a given FID
 */
export async function getRecentCasts(fid: number, limit: number = 25): Promise<CastData[]> {
  // Validate fid
  if (!fid || typeof fid !== 'number' || fid <= 0 || !Number.isInteger(fid)) {
    console.error('Invalid fid:', fid);
    return [];
  }
  
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
        const errorText = await response.text();
        console.error('Failed to fetch casts:', response.status, errorText);
        if (response.status === 429) {
          console.error('⚠️ Rate limit exceeded! Please wait a moment and try again.');
          throw new Error('API rate limit exceeded. Please try again in a few moments.');
        }
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
    
    const proxyUrl = API_BASE 
      ? `${API_BASE}/api/neynar-proxy?endpoint=casts&fid=${fid}&limit=${limit}`
      : `/api/neynar-proxy?endpoint=casts&fid=${fid}&limit=${limit}`;
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to fetch casts:', response.status, errorText);
      if (response.status === 429) {
        console.error('⚠️ Rate limit exceeded! Please wait a moment and try again.');
        throw new Error('API rate limit exceeded. Please try again in a few moments.');
      }
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
 * Extract mentioned usernames from casts
 * Returns array of unique usernames (without @)
 */
export function extractMentionsFromCasts(casts: CastData[]): string[] {
  const mentions = new Set<string>();
  
  for (const cast of casts) {
    // Extract @username patterns
    const mentionRegex = /@(\w+)/g;
    let match;
    while ((match = mentionRegex.exec(cast.text)) !== null) {
      const username = match[1].toLowerCase();
      mentions.add(username);
    }
  }
  
  return Array.from(mentions);
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

