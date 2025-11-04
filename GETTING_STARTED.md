# Getting Started

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Neynar API key ([get one here](https://neynar.com))

## Installation

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

**Note**: `VITE_API_BASE_URL` is optional. Leave it empty or set to `http://localhost:3000` for local development.

## Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

