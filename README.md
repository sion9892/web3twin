# Web3Twin

Find your Farcaster twin based on your recent cast vibes!

🌐 URL: [https://web3twin.vercel.app/]

## Concept

Web3Twin analyzes your recent Farcaster casts and compares them with users in your network (followers/following) to find someone with a similar vibe. The matching algorithm uses:

- **Text similarity**: Measures how many keywords two users share in common
- **Hashtag overlap**: Compares shared hashtags between users 
- **Emoji usage patterns**

## Features

- 4-step interactive flow
- Beautiful, modern UI with animations
- Real-time analysis progress tracking
- Shareable results via Farcaster
- Base Smart Wallet integration for NFT minting
- On-chain NFT badges for twin matches

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Custom CSS with modern design
- **Blockchain**: Base Smart Wallet (via wagmi)
- **API**: Neynar REST API v2
- **Backend**: Serverless functions (Vercel)
- **Smart Contracts**: Solidity (Hardhat)
- **Deployment**: Vercel

## Project Structure

```
web3twin/
├── api/
│   ├── neynar-proxy.ts         # Serverless API proxy
│   ├── metadata/
│   │   └── [tokenId].ts        # NFT metadata endpoint
│   └── image/
│       └── [tokenId].ts        # NFT image endpoint
├── contracts/
│   └── Web3TwinNFT.sol         # ERC721 NFT contract
├── src/
│   ├── components/
│   │   ├── Step1Handle.tsx     # Farcaster handle input
│   │   ├── Step2Preview.tsx   # Cast analysis & candidate loading
│   │   ├── Step3Result.tsx    # Twin match display & NFT minting
│   │   ├── Step4Share.tsx     # Share results
│   │   ├── CustomWalletButton.tsx  # Wallet connection UI
│   │   └── NFTSuccessModal.tsx     # NFT mint success modal
│   ├── hooks/
│   │   ├── useMintNFT.ts       # NFT minting hook
│   │   └── useUserNFTs.ts      # User NFT fetching hook
│   ├── lib/
│   │   ├── neynar.ts          # Neynar API client
│   │   ├── similarity.ts      # Similarity algorithms
│   │   ├── wagmi.ts           # Wagmi config (Base Smart Wallet)
│   │   └── generateNFTSVG.ts  # NFT SVG generation
│   ├── App.tsx                # Main app with state management
│   ├── main.tsx               # Entry point
│   └── index.css              # Styles
├── package.json
├── tsconfig.json
├── vite.config.ts
├── hardhat.config.cjs         # Hardhat config for contract deployment
└── vercel.json
```

## Quick Links

- 📖 [Getting Started Guide](./GETTING_STARTED.md) - Local development setup
- 🚀 [Deployment Guide](./DEPLOYMENT.md) - How to deploy to Vercel

## How It Works

### Step 1: Input Handle
User enters their Farcaster handle (e.g., `@username`). The app fetches their FID and profile info.

### Step 2: Analysis
1. Fetches user's recent 25 casts
2. Extracts mentioned users (@username) from casts
3. Selects up to 50 mentioned users as candidates and randomly samples up to 40
4. **Note**: If no mentioned users are found, uses self-match as candidate.
5. Fetches recent 25 casts for each candidate
6. Preprocesses all casts (tokenization, hashtag/emoji extraction)

### Step 3: Match & Mint
1. Calculates similarity scores using weighted formula:
   - 60% text Jaccard similarity
   - 25% hashtag overlap
   - 15% emoji overlap
2. Selects the best match
3. Displays match card with similarity %, shared signals, and breakdown
4. User connects Base Smart Wallet and mints NFT badge on Base chain

### Step 4: Share
User can share their twin match on Farcaster or copy the share text with transaction link.

## Similarity Algorithm

The core matching algorithm (`lib/similarity.ts`) uses:

1. **Text Similarity**: Measures how many keywords two users share in common. Calculated as `intersection / union` of word sets (Jaccard Similarity)
2. **Overlap Coefficient** for hashtags/emojis: `intersection / min(size)`
3. **Final Score**: `0.6·text + 0.25·hashtag + 0.15·emoji`

## Wallet Integration

Web3Twin uses **Base Smart Wallet** for seamless on-chain NFT minting:
- No browser extension required
- Gas-optimized transactions on Base network
- Secure, non-custodial wallet experience
- Create wallet without complex seed phrases

## Limitations

- **Candidate Selection**: Currently uses only users mentioned in casts due to free API limitations
- Analysis is based on recent ~25 casts per user
- Sample size is capped at 40 candidates for performance
- NFT metadata is stored on-chain, but images are served dynamically
- The similarity algorithm only works with English casts.

## Future Enhancements

- [x] Mint twin match as NFT badge on Base chain ✅
- [ ] Expand candidates to include following/followers using paid Neynar API
- [ ] More advanced similarity algorithms
- [ ] Multi-language support
- [ ] NFT marketplace integration

## License

MIT

## Credits

**Base Korea** - This project is part of the Base Korea community, showcasing the power of Base Smart Wallet and on-chain NFT minting on the Base network.

**Neynar** - Built with [Neynar API](https://neynar.com) for Farcaster data.

---

# Web3Twin (한국어)

최근 캐스트 분위기를 기반으로 Farcaster에서 당신의 트윈을 찾아보세요!

🌐 URL: [https://web3twin.vercel.app/]

## 컨셉

Web3Twin은 최근 Farcaster 캐스트를 분석하고 네트워크(팔로워/팔로잉)의 사용자들과 비교하여 비슷한 분위기의 사람을 찾습니다. 매칭 알고리즘은 다음을 사용합니다:

- **텍스트 유사도**: 두 사용자가 공통으로 사용한 키워드의 비율을 측정합니다
- **해시태그 겹침**: 사용자 간 공유된 해시태그를 비교합니다
- **이모지 사용 패턴**: 공통 이모지 사용을 분석합니다

## 주요 기능

- 4단계 인터랙티브 플로우
- 아름답고 현대적인 애니메이션 UI
- 실시간 분석 진행 상황 추적
- Farcaster를 통한 공유 가능한 결과
- NFT 민팅을 위한 Base Smart Wallet 통합
- 트윈 매칭을 위한 온체인 NFT 배지

## 기술 스택

- **프론트엔드**: React + TypeScript + Vite
- **스타일링**: 현대적인 디자인의 커스텀 CSS
- **블록체인**: Base Smart Wallet (via wagmi)
- **API**: Neynar REST API v2
- **백엔드**: 서버리스 함수 (Vercel)
- **스마트 컨트랙트**: Solidity (Hardhat)
- **배포**: Vercel

## 프로젝트 구조

```
web3twin/
├── api/
│   ├── neynar-proxy.ts         # 서버리스 API 프록시
│   ├── metadata/
│   │   └── [tokenId].ts        # NFT 메타데이터 엔드포인트
│   └── image/
│       └── [tokenId].ts        # NFT 이미지 엔드포인트
├── contracts/
│   └── Web3TwinNFT.sol         # ERC721 NFT 컨트랙트
├── src/
│   ├── components/
│   │   ├── Step1Handle.tsx     # Farcaster 핸들 입력
│   │   ├── Step2Preview.tsx   # 캐스트 분석 및 후보 로딩
│   │   ├── Step3Result.tsx    # 트윈 매칭 표시 및 NFT 민팅
│   │   ├── Step4Share.tsx     # 결과 공유
│   │   ├── CustomWalletButton.tsx  # 지갑 연결 UI
│   │   └── NFTSuccessModal.tsx     # NFT 민팅 성공 모달
│   ├── hooks/
│   │   ├── useMintNFT.ts       # NFT 민팅 훅
│   │   └── useUserNFTs.ts      # 사용자 NFT 가져오기 훅
│   ├── lib/
│   │   ├── neynar.ts          # Neynar API 클라이언트
│   │   ├── similarity.ts      # 유사도 알고리즘
│   │   ├── wagmi.ts           # Wagmi 설정 (Base Smart Wallet)
│   │   └── generateNFTSVG.ts  # NFT SVG 생성
│   ├── App.tsx                # 상태 관리가 있는 메인 앱
│   ├── main.tsx               # 진입점
│   └── index.css              # 스타일
├── package.json
├── tsconfig.json
├── vite.config.ts
├── hardhat.config.cjs         # 컨트랙트 배포용 Hardhat 설정
└── vercel.json
```

## 빠른 링크

- 📖 [시작 가이드](./GETTING_STARTED.md) - 로컬 개발 환경 설정
- 🚀 [배포 가이드](./DEPLOYMENT.md) - Vercel 배포 방법

## 가이드

### 1단계: 핸들 입력
사용자가 Farcaster 핸들(예: `@username`)을 입력합니다. 앱이 FID와 프로필 정보를 가져옵니다.

### 2단계: 분석
1. 사용자의 최근 25개 캐스트 가져오기
2. 캐스트에서 언급된 사용자들(@username) 추출
3. 언급된 사용자들 중 최대 50명을 후보로 선택하고, 최대 40명 무작위 샘플링
4. **참고**: 언급된 사용자가 없으면 본인(self-match)을 후보로 사용합니다.
5. 각 후보의 최근 25개 캐스트 가져오기
6. 모든 캐스트 전처리(토큰화, 해시태그/이모지 추출)

### 3단계: 매칭 & 민팅
1. 가중 공식을 사용하여 유사도 점수 계산:
   - 60% 텍스트 유사도
   - 25% 해시태그 겹침
   - 15% 이모지 겹침
2. 최고 매칭 선택
3. 유사도 %, 공유 신호 및 세부 정보가 포함된 매칭 카드 표시
4. 사용자가 Base Smart Wallet을 연결하고 Base 체인에서 NFT 배지 민팅

### 4단계: 공유
사용자가 Farcaster에서 트윈 매칭을 공유하거나 트랜잭션 링크가 포함된 공유 텍스트를 복사할 수 있습니다.

## 유사도 알고리즘

핵심 매칭 알고리즘(`lib/similarity.ts`)은 다음을 사용합니다:

1. **텍스트 유사도**: 두 사용자가 공통으로 사용한 키워드의 비율을 측정합니다. 단어 집합의 `교집합 / 합집합` 공식으로 계산됩니다 
2. 해시태그/이모지에 대한 **겹침 계수**: `교집합 / 최소 크기`
3. **최종 점수**: `0.6·텍스트 + 0.25·해시태그 + 0.15·이모지`

## 지갑 통합

Web3Twin은 원활한 온체인 NFT 민팅을 위해 **Base Smart Wallet**을 사용합니다:
- 브라우저 확장 프로그램 불필요
- Base 네트워크에서 가스 최적화된 트랜잭션
- 안전한 비수탁형 지갑 경험
- 복잡한 시드구문 없이 지갑 생성 가능

## 제한사항

- **후보 선택**: 현재는 무료 API 인 관계로 본인이 언급한 사용자만 리스트로 합니다
- 분석은 사용자당 최근 ~25개 캐스트를 기반으로 합니다
- 성능을 위해 샘플 크기는 40명의 후보로 제한됩니다
- NFT 메타데이터는 온체인에 저장되지만 이미지는 동적으로 제공됩니다
- 유사도 알고리즘은 영어 캐스트 기반으로만 되어있습니다

## 향후 개선사항

- [x] Base 체인에서 트윈 매칭을 NFT 배지로 민팅 ✅
- [ ] 유료 Neynar API 사용하여 후보를 following/follwer 까지 확장.
- [ ] 더 고급 유사도 알고리즘
- [ ] 다국어 지원
- [ ] NFT 마켓플레이스 통합

## 라이선스

MIT

## 크레딧

**Base Korea** - 이 프로젝트는 Base Korea 커뮤니티의 일부로, Base Smart Wallet의 힘과 Base 네트워크에서의 온체인 NFT 민팅을 보여줍니다.

**Neynar** - Farcaster 데이터를 위한 [Neynar API](https://neynar.com)로 구축되었습니다.

