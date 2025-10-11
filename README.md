# Web3Twin 🎭

Find your Farcaster twin based on your recent cast vibes!

## Concept

Web3Twin analyzes your recent Farcaster casts and compares them with users in your network (followers/following) to find someone with a similar vibe. The matching algorithm uses:

- **Text similarity** (Jaccard similarity on keywords)
- **Hashtag overlap** 
- **Emoji usage patterns**
- **GM streak bonus** (for users who both say "gm" regularly)

## Features

- 4-step interactive flow
- Beautiful, modern UI with animations
- Real-time analysis progress tracking
- Shareable results via Warpcast
- No on-chain transactions required (wallet connection reserved for future)

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Custom CSS with modern design
- **API**: Neynar REST API v2
- **Backend**: Serverless functions (Vercel)
- **Deployment**: Vercel

## Project Structure

```
web3twin/
├── api/
│   └── neynar-proxy.ts         # Serverless API proxy
├── src/
│   ├── components/
│   │   ├── Step1Handle.tsx     # Farcaster handle input
│   │   ├── Step2Preview.tsx    # Cast analysis & candidate loading
│   │   └── Step3Result.tsx     # Twin match display
│   ├── lib/
│   │   ├── neynar.ts          # Neynar API client
│   │   └── similarity.ts      # Similarity algorithms
│   ├── App.tsx                # Main app with state management
│   ├── main.tsx               # Entry point
│   └── index.css              # Styles
├── package.json
├── tsconfig.json
├── vite.config.ts
└── vercel.json
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Neynar API key ([get one here](https://neynar.com))

### Installation

1. Clone the repository:
```bash
git clone <repo-url>
cd web3twin
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Add your Neynar API key to `.env`:
```
NEYNAR_API_KEY=your_neynar_api_key_here
VITE_API_BASE_URL=http://localhost:3000
```

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Vercel Deployment

1. Install Vercel CLI (optional):
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard:
   - `NEYNAR_API_KEY`: Your Neynar API key
   - `VITE_API_BASE_URL`: Your production URL (e.g., `https://web3twin.vercel.app`)

4. The app will be available at your Vercel URL!

### Environment Variables

- `NEYNAR_API_KEY` (required): Your Neynar API key for Farcaster data
- `VITE_API_BASE_URL` (optional): Base URL for API calls, defaults to current domain

## How It Works

### Step 1: Input Handle
User enters their Farcaster handle (e.g., `@username`). The app fetches their FID and profile info.

### Step 2: Analysis
1. Fetches user's recent 25 casts
2. Loads their followers and following lists
3. Randomly samples 40 candidates from the combined network
4. Fetches recent 25 casts for each candidate
5. Preprocesses all casts (tokenization, hashtag/emoji extraction)

### Step 3: Match
1. Calculates similarity scores using weighted formula:
   - 60% text Jaccard similarity
   - 25% hashtag overlap
   - 15% emoji overlap
   - Bonus for matching "gm" streaks
2. Selects the best match
3. Displays match card with similarity %, shared signals, and breakdown

### Step 4: Share
User can share their twin match on Warpcast or copy the share text.

## Similarity Algorithm

The core matching algorithm (`lib/similarity.ts`) uses:

1. **Jaccard Similarity** for text: `intersection / union` of word sets
2. **Overlap Coefficient** for hashtags/emojis: `intersection / min(size)`
3. **GM Bonus**: Extra points if both users have "gm" in recent casts
4. **Final Score**: `0.6·text + 0.25·hashtag + 0.15·emoji + gmBonus`

## API Endpoints

The serverless proxy (`api/neynar-proxy.ts`) exposes:

- `GET /api/neynar-proxy?endpoint=user&username=<handle>` - Get user by username
- `GET /api/neynar-proxy?endpoint=followers&fid=<fid>&limit=<n>` - Get followers
- `GET /api/neynar-proxy?endpoint=following&fid=<fid>&limit=<n>` - Get following
- `GET /api/neynar-proxy?endpoint=casts&fid=<fid>&limit=<n>` - Get recent casts

## Limitations

- Candidates are limited to followers/following (no global search)
- Analysis is based on recent ~25 casts per user
- Sample size is capped at 40 candidates for performance
- No persistent storage (results are not saved)

## Future Enhancements

- [ ] Mint twin match as NFT badge
- [ ] Save match history
- [ ] More advanced similarity algorithms (TF-IDF, embeddings)
- [ ] Global trending twin matches
- [ ] Multi-language support
- [ ] Advanced filters (by interests, topics)

## License

MIT

## Credits

Built with [Neynar API](https://neynar.com) for Farcaster data.

