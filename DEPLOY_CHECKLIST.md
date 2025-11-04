# 🚀 Vercel 배포 전 체크리스트

## ✅ 빌드 상태
- [x] 로컬 빌드 성공 (`npm run build` 완료)
- [x] TypeScript 컴파일 오류 없음
- [x] Vite 빌드 성공

## ⚠️ 배포 전 필수 확인 사항

### 1. Vercel 환경 변수 설정 (필수!)
Vercel 대시보드 > Settings > Environment Variables에서 다음 변수들을 **Production 환경**에 설정하세요:

#### 클라이언트 접근 가능 (VITE_ 접두사)
- [ ] `VITE_NEYNAR_API_KEY` - Neynar API 키
- [ ] `VITE_API_BASE_URL` - **빈 값으로 설정** (상대 경로 사용)
- [ ] `VITE_COINBASE_API_KEY` - Coinbase API 키
- [ ] `VITE_WALLETCONNECT_PROJECT_ID` - WalletConnect 프로젝트 ID (32자)
- [ ] `VITE_BASE_RPC_URL` - `https://mainnet.base.org` (또는 기본값 사용)

#### 서버 사이드 전용 (VITE_ 접두사 없음)
- [ ] `NEYNAR_API_KEY` - Neynar API 키 (서버 사이드, api/neynar-proxy.ts에서 사용)

### 2. 코드 상태 확인
- [x] `localhost:3000` 하드코딩 없음
- [x] Base Sepolia 관련 코드 제거됨
- [x] 환경 변수 타입 정의 완료 (`src/vite-env.d.ts`)

### 3. API 함수 확인
- [x] `api/neynar-proxy.ts` - 서버 사이드 `NEYNAR_API_KEY` 사용
- [x] `api/metadata/[tokenId].ts` - NFT 메타데이터 제공
- [x] `api/image/[tokenId].ts` - NFT 이미지 제공

### 4. 잠재적 문제점
- ⚠️ **ESLint 설정 파일 없음** - 배포에는 영향 없지만 개발 시 경고 표시됨
- ⚠️ **큰 번들 크기 경고** - 일부 청크가 500KB 이상 (최적화 권장하지만 배포 가능)

## 🎯 배포 방법

### 방법 1: Vercel CLI
```bash
npm i -g vercel
vercel --prod
```

### 방법 2: GitHub 연동
1. GitHub에 코드 푸시
2. Vercel 대시보드에서 프로젝트 연결
3. 환경 변수 설정 (위 체크리스트 참고)
4. 자동 배포

## 🔍 배포 후 확인 사항

1. **환경 변수 확인**
   - 브라우저 콘솔에서 `import.meta.env` 확인
   - `VITE_API_BASE_URL`이 빈 값인지 확인

2. **API 함수 테스트**
   - `/api/neynar-proxy?endpoint=user&username=test` 호출 테스트
   - NFT 업로드 기능 테스트

3. **프로덕션 빌드 확인**
   - 빌드된 파일에 `localhost` 포함 여부 확인
   - Network 탭에서 API 호출이 상대 경로로 이루어지는지 확인

## ❌ 자주 발생하는 에러

### `localhost:3000` 에러
- **원인**: `VITE_API_BASE_URL`이 `http://localhost:3000`으로 설정됨
- **해결**: Vercel에서 `VITE_API_BASE_URL`을 **빈 값**으로 설정

### `NEYNAR_API_KEY is not defined`
- **원인**: 서버 사이드 `NEYNAR_API_KEY` 환경 변수 미설정
- **해결**: Vercel에서 `NEYNAR_API_KEY` (VITE_ 접두사 없음) 설정


## 📝 현재 상태
- ✅ 로컬 빌드 성공
- ✅ 코드 상태 정상
- ⚠️ Vercel 환경 변수 설정 필요 (위 체크리스트 참고)

**배포 준비 완료!** 환경 변수만 설정하면 배포 가능합니다.

