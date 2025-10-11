# 🔒 Security Checklist

## 민감한 정보 (절대 Git에 올리면 안 됨)

### ✅ API Keys & Secrets
- [ ] `.env` 파일 (Neynar API 키 포함)
- [ ] `NEYNAR_API_KEY` 환경 변수
- [ ] `WALLETCONNECT_PROJECT_ID`
- [ ] `PRIVATE_KEY` (개인키)

### ✅ Blockchain 관련
- [ ] `contract-info.json` (배포된 컨트랙트 주소)
- [ ] `deployments/` 폴더
- [ ] `artifacts/` 폴더 (컴파일된 컨트랙트)
- [ ] `cache/` 폴더

### ✅ 인증서 & 키 파일
- [ ] `*.pem`, `*.key` 파일
- [ ] `*.crt`, `*.cert` 파일
- [ ] `*.p12`, `*.pfx` 파일
- [ ] `wallets/`, `accounts/` 폴더

### ✅ 데이터베이스 & 로그
- [ ] `*.db`, `*.sqlite` 파일
- [ ] `sensitive-logs/` 폴더
- [ ] `test-data/` 폴더

## 🛡️ 보안 모범 사례

### 환경 변수 관리
1. **`.env` 파일 생성** - `env.example` 참고
2. **환경별 분리** - 개발/스테이징/프로덕션
3. **Vercel 환경 변수** - 배포 시 설정

### API 키 보안
1. **Neynar API 키** - 서버리스 프록시 사용
2. **WalletConnect** - 공개 프로젝트 ID만 사용
3. **개인키** - 절대 코드에 하드코딩 금지

### 컨트랙트 보안
1. **컨트랙트 주소** - 환경 변수로 관리
2. **배포 스크립트** - 로컬에서만 실행
3. **테스트넷 사용** - 메인넷 배포 전 충분한 테스트

## 🚨 긴급 상황 대응

### API 키 노출 시
1. **즉시 키 교체** - Neynar 대시보드에서
2. **Git 히스토리 정리** - `git filter-branch` 사용
3. **환경 변수 업데이트** - 모든 환경에서

### 개인키 노출 시
1. **즉시 지갑 이전** - 새로운 지갑으로
2. **기존 지갑 폐기** - 더 이상 사용 금지
3. **컨트랙트 재배포** - 새로운 주소로

## 📋 배포 전 체크리스트

- [ ] `.env` 파일이 `.gitignore`에 포함됨
- [ ] `contract-info.json`이 `.gitignore`에 포함됨
- [ ] 모든 민감한 정보가 환경 변수로 관리됨
- [ ] 테스트넷에서 충분한 테스트 완료
- [ ] 보안 스캔 완료 (의존성 취약점 등)
