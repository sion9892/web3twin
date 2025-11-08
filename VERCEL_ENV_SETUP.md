# Vercel 환경 변수 설정 가이드

## 🚨 현재 문제
NFT 민팅 시 Pinata API 키가 설정되지 않아 IPFS 업로드가 실패하고 있습니다.

## ✅ 해결 방법: Vercel 환경 변수 설정

### 1단계: Vercel 대시보드 접속
1. https://vercel.com/dashboard 접속
2. `web3twin` 프로젝트 선택

### 2단계: 환경 변수 설정
1. 프로젝트 페이지에서 **Settings** 탭 클릭
2. 왼쪽 메뉴에서 **Environment Variables** 클릭
3. 다음 환경 변수 추가:

#### Pinata JWT (추천)
- **Key**: `VITE_PINATA_JWT`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJlNGI2Y2VhOC02N2EwLTQ5MGUtYWMyMS1jNjg0MDYyMDFlMGEiLCJlbWFpbCI6InNpb24ucGFya0Bzb29rbXl1bmcuYWMua3IiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiYjg4MGVkZGM4ZWM1OGY0ODdmNmYiLCJzY29wZWRLZXlTZWNyZXQiOiI1ZWM2NThkYzI4ZTQyZjMzNmVmNTBlNWQyZTM5OTJmYzhlOWU1NjY2NTI1NGQwM2RhMzNiYWZlNThkMGQ1MzgwIiwiZXhwIjoxNzk0MTU2MTQzfQ.KUSIIylMqHfpZ4YepPhyUIuCBsJmJvLcA49j2NQhIV8`
- **Environment**: ✅ Production, ✅ Preview, ✅ Development 모두 선택
- **Save** 클릭

### 3단계: 재배포
환경 변수를 추가한 후:
1. **Deployments** 탭으로 이동
2. 최신 배포의 **⋯** (점 3개) 메뉴 클릭
3. **Redeploy** 선택
4. 또는 새로운 커밋을 푸시하면 자동으로 재배포됩니다

## ⚠️ 중요 사항

### JWT 토큰 만료 확인
현재 JWT 토큰의 만료일: `exp: 1794156143` (Unix timestamp)

만료일 확인 방법:
```bash
# 현재 시간 확인
date +%s

# 만료일 확인 (Unix timestamp를 날짜로 변환)
# 1794156143 = 2026년 11월 8일
```

만료되었다면:
1. https://www.pinata.cloud/ 접속
2. API Keys → 새 JWT 토큰 생성
3. Vercel 환경 변수 업데이트

### 환경 변수 확인
환경 변수가 제대로 설정되었는지 확인:
1. Vercel 대시보드 → Settings → Environment Variables
2. `VITE_PINATA_JWT`가 있는지 확인
3. 모든 환경(Production, Preview, Development)에 설정되어 있는지 확인

## 🧪 테스트

환경 변수 설정 후:
1. Vercel에서 재배포 완료 대기
2. 브라우저에서 앱 새로고침 (캐시 클리어: Cmd+Shift+R 또는 Ctrl+Shift+R)
3. NFT 민팅 시도
4. 브라우저 콘솔(F12)에서 다음 로그 확인:
   ```
   ✅ Pinata credentials check passed
   📤 Uploading SVG to IPFS...
   ✅ SVG uploaded to IPFS: ipfs://Qm...
   ```

## 📝 추가 확인 사항

### 다른 필수 환경 변수
다음 환경 변수도 설정되어 있는지 확인:
- `NEYNAR_API_KEY` (서버 사이드, VITE_ 접두사 없음)

### 문제 해결
여전히 에러가 발생하면:
1. 브라우저 콘솔(F12)에서 정확한 에러 메시지 확인
2. Vercel 배포 로그 확인 (Deployments → 최신 배포 → Logs)
3. 환경 변수가 올바르게 설정되었는지 다시 확인

