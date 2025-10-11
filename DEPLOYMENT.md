# Deployment Guide for Web3Twin

This guide will walk you through deploying Web3Twin to Vercel.

## Prerequisites

1. **Neynar API Key**: Sign up at [neynar.com](https://neynar.com) to get your API key
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **GitHub Account**: (Optional but recommended) for easier deployments

## Option 1: Deploy via Vercel CLI

### Step 1: Install Dependencies

```bash
cd web3twin
npm install
```

### Step 2: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 3: Login to Vercel

```bash
vercel login
```

### Step 4: Deploy

```bash
vercel
```

Follow the prompts:
- **Set up and deploy?** Yes
- **Which scope?** Select your account
- **Link to existing project?** No
- **Project name?** web3twin (or your preferred name)
- **Directory?** ./
- **Override settings?** No

### Step 5: Set Environment Variables

After deployment, set your environment variables:

```bash
vercel env add NEYNAR_API_KEY
```

When prompted, paste your Neynar API key and select all environments (Production, Preview, Development).

### Step 6: Deploy to Production

```bash
vercel --prod
```

Your app is now live! 🎉

## Option 2: Deploy via Vercel Dashboard

### Step 1: Push to GitHub

If you haven't already:

```bash
# Create a new repository on GitHub first, then:
git remote add origin https://github.com/yourusername/web3twin.git
git branch -M main
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import Project**
3. Select your GitHub repository
4. Click **Import**

### Step 3: Configure Project

Vercel should auto-detect the Vite framework. Verify settings:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 4: Add Environment Variables

1. In the **Environment Variables** section, add:
   - **Key**: `NEYNAR_API_KEY`
   - **Value**: Your Neynar API key
   - **Environments**: Select all (Production, Preview, Development)

2. Add another variable:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: Leave empty (will use current domain)
   - **Environments**: Production only

### Step 5: Deploy

Click **Deploy**. Vercel will build and deploy your app.

## Post-Deployment

### Update Share Links

After deployment, update the share text in your app to use your actual domain:

Edit `src/App.tsx` and `src/components/Step3Result.tsx`:

Replace `web3twin.vercel.app` with your actual Vercel URL.

Commit and push:
```bash
git add .
git commit -m "Update share links with production URL"
git push
```

Vercel will automatically redeploy.

### Test the API

Test your API proxy endpoints:

```bash
# Replace with your domain
curl "https://your-app.vercel.app/api/neynar-proxy?endpoint=user&username=dwr"
```

You should get a JSON response with user data.

### Custom Domain (Optional)

To add a custom domain:

1. Go to your project in Vercel Dashboard
2. Click **Settings** → **Domains**
3. Add your domain
4. Update DNS records as instructed
5. Wait for DNS propagation

## Testing Locally

Before deploying, test locally:

1. Create `.env` file:
```bash
cp .env.example .env
```

2. Add your Neynar API key:
```env
NEYNAR_API_KEY=your_key_here
VITE_API_BASE_URL=http://localhost:3000
```

3. Install and run:
```bash
npm install
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Troubleshooting

### API Key Not Working

- Verify your Neynar API key is valid
- Check environment variables are set correctly in Vercel
- Redeploy after setting environment variables

### CORS Issues

- The serverless function includes CORS headers
- If issues persist, check Vercel function logs

### Build Failures

- Ensure all dependencies are in `package.json`
- Check TypeScript errors with `npm run build` locally
- Review Vercel build logs

### Rate Limiting

- Neynar API has rate limits
- Consider implementing caching if needed
- Upgrade Neynar plan for higher limits

## Monitoring

### View Logs

In Vercel Dashboard:
1. Go to your project
2. Click **Functions** tab
3. Select `neynar-proxy` function
4. View invocation logs

### Analytics

Enable Vercel Analytics:
1. Go to your project
2. Click **Analytics** tab
3. Click **Enable**

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NEYNAR_API_KEY` | Yes | Your Neynar API key | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` |
| `VITE_API_BASE_URL` | No | Base URL for API calls | `https://web3twin.vercel.app` |

## Security

- **Never commit `.env` file** to Git
- **API key is server-side only** - never exposed to client
- **Serverless function validates all inputs** before calling Neynar
- **CORS is configured** to allow all origins (adjust if needed)

## Performance Tips

1. **Caching**: Consider adding edge caching for user lookups
2. **Parallel Requests**: The app already batches API calls efficiently
3. **Sample Size**: Adjust `SAMPLE_SIZE` in `Step2Preview.tsx` to balance accuracy vs speed
4. **CDN**: Vercel automatically serves static assets via CDN

## Support

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Neynar Docs**: [docs.neynar.com](https://docs.neynar.com)
- **Issues**: Open an issue on GitHub

---

Happy deploying! 🚀

