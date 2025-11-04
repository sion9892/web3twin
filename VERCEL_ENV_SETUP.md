# 🚀 Vercel 환경 변수 설정 가이드

이 문서는 Vercel Production 환경에 필요한 환경 변수를 설정하는 방법을 안내합니다.

## 📋 필수 환경 변수 목록

### 클라이언트 접근 가능 (VITE_ 접두사)

다음 변수들은 클라이언트 코드에서 접근 가능하므로 브라우저에 노출됩니다.

| 변수명 | 설명 | Production 값 예시 |
|--------|------|-------------------|
| `VITE_NEYNAR_API_KEY` | Neynar API 키 | `your_neynar_api_key` |
| `VITE_API_BASE_URL` | 🚨 **중요**: API Base URL | **빈 값** (권장) 또는 `https://web3twin.vercel.app` |
| `VITE_COINBASE_API_KEY` | Coinbase API 키 | `your_coinbase_api_key` |
| `VITE_WALLETCONNECT_PROJECT_ID` | WalletConnect 프로젝트 ID (32자) | `your_32_char_project_id` |
| `VITE_BASE_RPC_URL` | Base 네트워크 RPC URL | `https://mainnet.base.org` |
| `VITE_NFT_STORAGE_API_KEY` | NFT Storage API 키 (사용하는 경우) | `your_nft_storage_api_key` |

### 서버/빌드 전용 (VITE_ 접두사 없음)

다음 변수들은 서버 사이드에서만 사용되며 클라이언트 코드에서 접근할 수 없습니다.

| 변수명 | 설명 | Production 값 예시 |
|--------|------|-------------------|
| `PRIVATE_KEY` | 블록체인 프라이빗 키 | `your_private_key` (⚠️ 민감 정보) |
| `PINATA_API_KEY` | Pinata API 키 | `your_pinata_api_key` |
| `PINATA_SECRET_KEY` | Pinata 시크릿 키 | `your_pinata_secret_key` |
| `PINATA_GATEWAY` | Pinata Gateway URL | `https://gateway.pinata.cloud/ipfs/` |
| `BASE_RPC_URL` | Base 메인넷 RPC URL | `https://mainnet.base.org` |
| `BASE_SEPOLIA_RPC_URL` | Base Sepolia 테스트넷 RPC URL | `https://sepolia.base.org` |

## 🛠️ Vercel 대시보드에서 설정하기

### 1. 환경 변수 페이지 접근

1. [Vercel Dashboard](https://vercel.com/dashboard)에 로그인
2. 프로젝트 선택
3. **Settings** 탭 클릭
4. **Environment Variables** 섹션으로 이동

### 2. 환경 변수 추가

각 변수에 대해:

1. **Key** 필드에 변수명 입력 (예: `VITE_NEYNAR_API_KEY`)
2. **Value** 필드에 실제 값 입력
3. **Environment** 선택:
   - `Production`: 프로덕션 배포에만 적용
   - `Preview`: 프리뷰 배포에 적용
   - `Development`: 개발 환경에 적용
4. **Add** 버튼 클릭

### 3. 🚨 VITE_API_BASE_URL 설정 (가장 중요)

**문제 해결**: `http://localhost:3000` 에러를 방지하려면:

**옵션 1 (권장)**: 빈 값으로 설정
- Key: `VITE_API_BASE_URL`
- Value: **(비워두기)** 또는 아무것도 입력하지 않음
- 이렇게 하면 프로덕션에서 자동으로 상대 경로(`/api/...`)를 사용합니다.

**옵션 2**: 프로덕션 URL로 설정
- Key: `VITE_API_BASE_URL`
- Value: `https://web3twin.vercel.app` (실제 프로덕션 URL)
- ⚠️ 주의: 도메인이 변경되면 다시 업데이트해야 합니다.

## ✅ 체크리스트

설정 후 다음을 확인하세요:

- [ ] `VITE_NEYNAR_API_KEY`가 Production 환경에 설정됨
- [ ] `VITE_API_BASE_URL`이 **빈 값**으로 설정됨 (또는 프로덕션 URL)
- [ ] `VITE_COINBASE_API_KEY`가 Production 환경에 설정됨
- [ ] `VITE_WALLETCONNECT_PROJECT_ID`가 Production 환경에 설정됨
- [ ] `VITE_BASE_RPC_URL`이 Production 환경에 설정됨
- [ ] 서버 사이드 변수들(`PRIVATE_KEY`, `PINATA_*` 등)이 Production 환경에 설정됨
- [ ] 모든 변수가 올바른 환경(Production/Preview/Development)에 설정됨

## 🔄 재배포

환경 변수를 추가/수정한 후:

1. Vercel 대시보드에서 **Deployments** 탭으로 이동
2. 최신 배포 옆의 **⋯** 메뉴 클릭
3. **Redeploy** 선택
4. 또는 새 커밋을 푸시하여 자동 재배포

## 🐛 문제 해결

### localhost:3000 에러가 계속 발생하는 경우

1. **환경 변수 확인**:
   - Vercel 대시보드에서 `VITE_API_BASE_URL` 값 확인
   - 빈 값이어야 합니다 (비어있지 않으면 삭제 후 다시 추가)

2. **빌드 캐시 삭제**:
   - Vercel 대시보드 > Settings > General
   - "Clear Build Cache" 클릭

3. **강제 재배포**:
   - 새로운 커밋 푸시 또는 수동 재배포

### 환경 변수가 적용되지 않는 경우

1. **변수명 확인**: `VITE_` 접두사가 올바른지 확인
2. **환경 확인**: Production 환경에 설정되어 있는지 확인
3. **재배포**: 환경 변수 변경 후 반드시 재배포 필요

## 📚 참고 자료

- [Vercel Environment Variables 문서](https://vercel.com/docs/concepts/projects/environment-variables)
- [Vite Environment Variables 문서](https://vitejs.dev/guide/env-and-mode.html)

