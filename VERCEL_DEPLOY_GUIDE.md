# 🚀 Vercel 배포 가이드

## 📋 배포 전 체크리스트

### ✅ 현재 상태
- [x] 로컬 빌드 성공 (`npm run build` 완료)
- [x] TypeScript 컴파일 오류 없음
- [x] Git 리포지토리 연결됨 (`https://github.com/sion9892/web3twin.git`)

---

## 🎯 배포 방법 (2가지)

### 방법 1: GitHub 연동 (권장) ⭐

#### 1단계: 코드를 GitHub에 푸시
```bash
# 변경사항 커밋
git add .
git commit -m "feat: Step4 분리 및 UI 개선"

# GitHub에 푸시
git push origin feature/wallet-connection
```

#### 2단계: Vercel 대시보드에서 프로젝트 연결
1. [Vercel 대시보드](https://vercel.com/dashboard) 접속
2. **"Add New..."** → **"Project"** 클릭
3. GitHub 리포지토리 선택: `sion9892/web3twin`
4. 브랜치 선택: `feature/wallet-connection` (또는 `main`/`master`)
5. **"Deploy"** 클릭

#### 3단계: 환경 변수 설정 (⚠️ 필수!)
배포가 시작되면 바로 환경 변수를 설정하세요:

**Vercel 대시보드 > 프로젝트 > Settings > Environment Variables**

**Production 환경에 다음 변수들을 설정:**

| 변수명 | 값 | 설명 |
|--------|-----|------|
| `VITE_NEYNAR_API_KEY` | (실제 API 키) | Neynar API 키 |
| `VITE_API_BASE_URL` | **(빈 값)** | ⚠️ 중요: 빈 값으로 설정 |
| `VITE_COINBASE_API_KEY` | (실제 API 키) | Coinbase API 키 |
| `VITE_WALLETCONNECT_PROJECT_ID` | (프로젝트 ID) | WalletConnect 프로젝트 ID (32자) |
| `VITE_BASE_RPC_URL` | `https://mainnet.base.org` | Base 네트워크 RPC URL |
| `NEYNAR_API_KEY` | (실제 API 키) | 서버 사이드용 (VITE_ 없음) |

**⚠️ 중요:**
- `VITE_API_BASE_URL`은 **반드시 빈 값**으로 설정해야 합니다
- 이렇게 하면 프로덕션에서 상대 경로(`/api/...`)를 사용합니다
- `localhost:3000` 에러를 방지합니다

#### 4단계: 재배포
환경 변수 설정 후 **"Deployments"** 탭에서 **"Redeploy"** 클릭

---

### 방법 2: Vercel CLI

#### 1단계: Vercel CLI 설치
```bash
npm i -g vercel
```

#### 2단계: 로그인
```bash
vercel login
```

#### 3단계: 프로젝트 배포
```bash
# 프로덕션 배포
vercel --prod

# 또는 대화형 모드
vercel
```

#### 4단계: 환경 변수 설정
CLI로 배포한 경우에도 대시보드에서 환경 변수를 설정해야 합니다.

---

## 🔍 배포 후 확인 사항

### 1. 환경 변수 확인
브라우저 개발자 도구 > Console에서:
```javascript
console.log(import.meta.env.VITE_API_BASE_URL)
// 빈 문자열("")이어야 함
```

### 2. API 함수 테스트
- 네트워크 탭에서 API 호출이 상대 경로(`/api/neynar-proxy`)로 이루어지는지 확인
- `localhost:3000`이 포함되지 않았는지 확인

### 3. 기능 테스트
- [ ] Step1: 핸들 입력
- [ ] Step2: 분석 진행
- [ ] Step3: 매칭 결과 및 NFT 민팅
- [ ] Step4: Share 기능

---

## ❌ 자주 발생하는 에러 및 해결 방법

### 1. `localhost:3000` 에러
**증상:** 프로덕션에서 `localhost:3000`을 호출하려고 함

**해결:**
- Vercel에서 `VITE_API_BASE_URL`을 **빈 값**으로 설정
- 재배포

### 2. `NEYNAR_API_KEY is not defined`
**증상:** 서버 사이드 API 함수에서 에러 발생

**해결:**
- Vercel에서 `NEYNAR_API_KEY` (VITE_ 접두사 없음) 설정
- Production 환경에 설정했는지 확인

### 3. React 버전 충돌
**증상:** 빌드 시 `react@18.3.1` vs `react@19.2.0` 에러

**해결:**
- `package.json`의 `overrides` 설정이 이미 되어 있음
- Vercel 빌드 로그 확인

---

## 📝 배포 체크리스트

배포 전:
- [ ] 코드 커밋 및 푸시 완료
- [ ] 로컬 빌드 성공 확인 (`npm run build`)
- [ ] 환경 변수 목록 확인 (`env.example` 참고)

배포 중:
- [ ] Vercel 프로젝트 생성/연결
- [ ] 환경 변수 설정 (위 표 참고)
- [ ] 재배포 (환경 변수 설정 후)

배포 후:
- [ ] 환경 변수 확인 (브라우저 콘솔)
- [ ] API 호출 테스트
- [ ] 전체 플로우 테스트

---

## 🎉 배포 완료!

배포가 완료되면 Vercel에서 제공하는 URL로 접속할 수 있습니다:
- 예: `https://web3twin-xxx.vercel.app`

**현재 브랜치:** `feature/wallet-connection`
**GitHub 리포지토리:** `https://github.com/sion9892/web3twin.git`

---

## 💡 추가 팁

1. **프로덕션 도메인 설정**
   - Vercel 대시보드 > Settings > Domains에서 커스텀 도메인 추가 가능

2. **자동 배포**
   - GitHub에 푸시하면 자동으로 배포됩니다 (설정 가능)

3. **프리뷰 배포**
   - Pull Request 생성 시 자동으로 프리뷰 배포 URL이 생성됩니다

4. **환경 변수 관리**
   - Production, Preview, Development 환경별로 다른 값 설정 가능

