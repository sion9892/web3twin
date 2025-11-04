# Deployment Guide

## Vercel Deployment

1. Install Vercel CLI (optional):
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard:
   - Go to **Settings > Environment Variables** in your Vercel project
   - Add the following variables for **Production** environment:
   
   **Required:**
   - `NEYNAR_API_KEY` (server-side, no VITE_ prefix): Your Neynar API key

4. Redeploy your project after setting environment variables.

5. The app will be available at your Vercel URL!


