# Web3Twin Quick Start Guide 🚀

Get Web3Twin up and running in 5 minutes!

## TL;DR

```bash
cd web3twin
npm install
cp .env.example .env
# Add your NEYNAR_API_KEY to .env
npm run dev
```

Open http://localhost:3000 and enter a Farcaster handle to find your twin!

---

## Detailed Steps

### 1. Get Your Neynar API Key

1. Go to [neynar.com](https://neynar.com)
2. Sign up for a free account
3. Navigate to your dashboard
4. Copy your API key

### 2. Set Up the Project

```bash
# Navigate to the project
cd web3twin

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### 3. Configure Environment

Edit `.env` and add your API key:

```env
NEYNAR_API_KEY=your_neynar_api_key_here
VITE_API_BASE_URL=http://localhost:3000
```

### 4. Run the Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

### 5. Test the App

1. Open the app in your browser
2. Enter a Farcaster handle (e.g., `dwr` or `vitalik`)
3. Click "Start Analysis"
4. Wait for the analysis to complete
5. View your twin match!

---

## Common Issues

### "User not found"
- Make sure the Farcaster handle exists
- Try without the `@` symbol
- Some users may have private profiles

### "NEYNAR_API_KEY not configured"
- Check your `.env` file exists
- Verify the API key is correct
- Restart the dev server after editing `.env`

### "No candidates found"
- The user might not have followers/following
- Try a different, more active user

### API Rate Limits
- Free Neynar tier has rate limits
- Wait a few minutes between analyses
- Consider upgrading your Neynar plan

---

## Next Steps

- **Deploy to Production**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Customize**: Edit components in `src/components/`
- **Adjust Algorithm**: Tweak weights in `src/lib/similarity.ts`
- **Add Features**: Check README.md for enhancement ideas

---

## Project Structure Overview

```
web3twin/
├── api/
│   └── neynar-proxy.ts      # API proxy (keeps key secure)
├── src/
│   ├── components/           # React components
│   ├── lib/                  # Utilities & algorithms
│   ├── App.tsx              # Main app
│   └── index.css            # Styles
└── package.json
```

---

## Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## How the App Works

### Step 1: Input Handle
- User enters Farcaster handle
- App fetches FID and profile info via Neynar API

### Step 2: Analysis
- Loads user's recent 25 casts
- Fetches followers and following lists
- Samples 40 random candidates
- Loads casts for each candidate
- Extracts keywords, hashtags, emojis

### Step 3: Match Calculation
- Computes similarity scores:
  - 60% text similarity (Jaccard)
  - 25% hashtag overlap
  - 15% emoji overlap
  - Bonus for matching "gm" usage
- Selects best match

### Step 4: Share
- Displays match card with details
- Generates share text for Warpcast
- Links to view twin's profile

---

## Customization Tips

### Change Sample Size
In `src/components/Step2Preview.tsx`:
```typescript
const SAMPLE_SIZE = 40; // Increase for more candidates (slower)
const CAST_LIMIT = 25;  // Increase for more cast history
```

### Adjust Similarity Weights
In `src/lib/similarity.ts`:
```typescript
const similarity = 
  0.6 * textJaccard +      // Text weight
  0.25 * hashtagOverlap +  // Hashtag weight
  0.15 * emojiOverlap +    // Emoji weight
  gmBonus;                 // GM bonus
```

### Modify UI Colors
In `src/index.css`:
```css
:root {
  --primary: #8b5cf6;     /* Main purple */
  --secondary: #ec4899;   /* Pink accent */
  /* ... */
}
```

---

## API Endpoints

The serverless proxy provides:

| Endpoint | Description |
|----------|-------------|
| `?endpoint=user&username=X` | Get user by handle |
| `?endpoint=followers&fid=X` | Get followers |
| `?endpoint=following&fid=X` | Get following |
| `?endpoint=casts&fid=X` | Get recent casts |

Test locally:
```bash
curl "http://localhost:3000/api/neynar-proxy?endpoint=user&username=dwr"
```

---

## Tips for Best Results

1. **Choose active users** with recent casts
2. **Users with followers/following** work best
3. **Users who use hashtags/emojis** show more detailed matches
4. **Accounts with varied content** produce interesting results

---

## Need Help?

- Check [README.md](./README.md) for detailed documentation
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment guide
- Review code comments in source files
- Open an issue on GitHub

---

Enjoy finding your Web3 Twin! 🎭✨

