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
        neynarUrl = `${NEYNAR_BASE_URL}/followers?${params}`;
        break;
      }

      case 'following': {
        if (!queryParams.fid || typeof queryParams.fid !== 'string') {
          return res.status(400).json({ error: 'Missing fid parameter' });
        }
        params.append('fid', queryParams.fid);
        params.append('limit', (queryParams.limit as string) || '100');
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
      const errorData = (await response.json()) as NeynarError;
      return res.status(response.status).json({
        error: errorData.message || 'Neynar API error',
        code: errorData.code,
      });
    }

    const data = await response.json();

    // Transform response based on endpoint
    switch (endpoint) {
      case 'user': {
        return res.status(200).json({
          user: {
            fid: data.result?.user?.fid,
            username: data.result?.user?.username,
            display_name: data.result?.user?.display_name,
            pfp_url: data.result?.user?.pfp_url,
            follower_count: data.result?.user?.follower_count,
            following_count: data.result?.user?.following_count,
          },
        });
      }

      case 'followers':
      case 'following': {
        return res.status(200).json({
          users: data.result?.users?.map((user: any) => ({
            fid: user.fid,
            username: user.username,
            display_name: user.display_name,
            pfp_url: user.pfp_url,
          })) || [],
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

