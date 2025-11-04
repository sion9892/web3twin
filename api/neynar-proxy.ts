import type { VercelRequest, VercelResponse } from '@vercel/node';

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;
const NEYNAR_BASE_URL = 'https://api.neynar.com/v2/farcaster';

interface NeynarError {
  message: string;
  code?: string;
}

/**
 * Serverless function to proxy Neynar API requests
 * This keeps the API key secure on the server side
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!NEYNAR_API_KEY) {
    return res.status(500).json({ error: 'NEYNAR_API_KEY not configured' });
  }

  try {
    const { endpoint, ...queryParams } = req.query;

    if (!endpoint || typeof endpoint !== 'string') {
      return res.status(400).json({ error: 'Missing endpoint parameter' });
    }

    let neynarUrl = '';
    const params = new URLSearchParams();

    // Route to appropriate Neynar endpoint
    switch (endpoint) {
      case 'user': {
        if (!queryParams.username || typeof queryParams.username !== 'string') {
          return res.status(400).json({ error: 'Missing username parameter' });
        }
        params.append('username', queryParams.username);
        neynarUrl = `${NEYNAR_BASE_URL}/user/by_username?${params}`;
        break;
      }

      case 'followers': {
        if (!queryParams.fid || typeof queryParams.fid !== 'string') {
          return res.status(400).json({ error: 'Missing fid parameter' });
        }
        params.append('fid', queryParams.fid);
        params.append('limit', (queryParams.limit as string) || '100');
        // viewer_fid를 추가하여 더 많은 정보를 받아올 수 있도록 함
        if (queryParams.viewer_fid) {
          params.append('viewer_fid', queryParams.viewer_fid as string);
        }
        neynarUrl = `${NEYNAR_BASE_URL}/followers?${params}`;
        break;
      }

      case 'following': {
        if (!queryParams.fid || typeof queryParams.fid !== 'string') {
          return res.status(400).json({ error: 'Missing fid parameter' });
        }
        params.append('fid', queryParams.fid);
        params.append('limit', (queryParams.limit as string) || '100');
        // viewer_fid를 추가하여 더 많은 정보를 받아올 수 있도록 함
        if (queryParams.viewer_fid) {
          params.append('viewer_fid', queryParams.viewer_fid as string);
        }
        neynarUrl = `${NEYNAR_BASE_URL}/following?${params}`;
        break;
      }

      case 'casts': {
        if (!queryParams.fid || typeof queryParams.fid !== 'string') {
          return res.status(400).json({ error: 'Missing fid parameter' });
        }
        params.append('fid', queryParams.fid);
        params.append('limit', (queryParams.limit as string) || '25');
        neynarUrl = `${NEYNAR_BASE_URL}/casts?${params}`;
        break;
      }

      default:
        return res.status(400).json({ error: 'Invalid endpoint' });
    }

    // Make request to Neynar API
    const response = await fetch(neynarUrl, {
      headers: {
        'accept': 'application/json',
        'api_key': NEYNAR_API_KEY,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData: NeynarError;
      try {
        errorData = JSON.parse(errorText) as NeynarError;
      } catch {
        errorData = { message: errorText };
      }
      
      // Rate limit 에러 명시적으로 처리
      if (response.status === 429) {
        return res.status(429).json({
          error: 'API rate limit exceeded. Please try again in a few moments.',
          code: 'RATE_LIMIT_EXCEEDED',
        });
      }
      
      return res.status(response.status).json({
        error: errorData.message || 'Neynar API error',
        code: errorData.code,
      });
    }

    const data = await response.json();

    // Debug: Log full API response for followers/following
    if (endpoint === 'followers' || endpoint === 'following') {
      console.log(`🔍 Neynar ${endpoint} API response sample:`, JSON.stringify(data.result?.users?.[0], null, 2));
    }

    // Transform response based on endpoint
    switch (endpoint) {
      case 'user': {
        // Neynar API 응답 구조: data.result.user 또는 data.user
        const userData = data.result?.user || data.user;
        
        if (!userData) {
          console.error('❌ No user data in Neynar response:', JSON.stringify(data, null, 2));
          return res.status(404).json({ error: 'User not found' });
        }
        
        return res.status(200).json({
          user: {
            fid: userData.fid,
            username: userData.username,
            display_name: userData.display_name,
            pfp_url: userData.pfp_url,
            follower_count: userData.follower_count,
            following_count: userData.following_count,
          },
        });
      }

      case 'followers':
      case 'following': {
        const users = data.result?.users?.map((user: any) => {
          // pfp 객체를 우선적으로 활용 (pfp?.url → pfp_url → pfpUrl 순서)
          const pfpUrl = user.pfp?.url || user.pfp_url || user.pfpUrl || '';
          
          // pfp 객체 확인
          if (user.pfp) {
            console.log(`🔍 Proxy User ${user.username} has pfp object:`, JSON.stringify(user.pfp, null, 2));
            console.log(`🔍 Using pfp.url: ${user.pfp?.url || '없음'}`);
          }
          
          // 디버깅: 실제 user 객체의 모든 필드 확인
          if (!pfpUrl) {
            console.log(`⚠️ User ${user.username} has no pfp_url. Available fields:`, Object.keys(user));
            console.log(`⚠️ User object:`, JSON.stringify(user, null, 2));
            if (user.pfp) {
              console.log(`⚠️ But has pfp object:`, user.pfp);
            }
          }
          
          return {
            fid: user.fid,
            username: user.username,
            display_name: user.display_name,
            pfp_url: pfpUrl,
            pfp: user.pfp, // pfp 객체 전체도 반환
          };
        }) || [];
        
        console.log(`🔍 Proxy returning ${users.length} users`);
        if (users.length > 0) {
          console.log(`🔍 First user pfp_url:`, users[0]?.pfp_url);
          console.log(`🔍 Users with pfp_url:`, users.filter((u: { pfp_url?: string }) => u.pfp_url).length);
        }
        
        return res.status(200).json({
          users,
        });
      }

      case 'casts': {
        return res.status(200).json({
          casts: data.result?.casts?.map((cast: any) => ({
            text: cast.text,
            author_fid: cast.author?.fid,
            hash: cast.hash,
            timestamp: cast.timestamp,
          })) || [],
        });
      }

      default:
        return res.status(200).json(data);
    }
  } catch (error) {
    console.error('Error proxying Neynar request:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

