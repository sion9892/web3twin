# Pinata JWT 토큰 설정 가이드

## ✅ 받으신 JWT 토큰

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJlNGI2Y2VhOC02N2EwLTQ5MGUtYWMyMS1jNjg0MDYyMDFlMGEiLCJlbWFpbCI6InNpb24ucGFya0Bzb29rbXl1bmcuYWMua3IiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiYjg4MGVkZGM4ZWM1OGY0ODdmNmYiLCJzY29wZWRLZXlTZWNyZXQiOiI1ZWM2NThkYzI4ZTQyZjMzNmVmNTBlNWQyZTM5OTJmYzhlOWU1NjY2NTI1NGQwM2RhMzNiYWZlNThkMGQ1MzgwIiwiZXhwIjoxNzk0MTU2MTQzfQ.KUSIIylMqHfpZ4YepPhyUIuCBsJmJvLcA49j2NQhIV8
```

이 JWT 토큰은 올바른 형식입니다! ✅

## 🔧 환경 변수 설정

### 로컬 개발 (.env 파일)

프로젝트 루트에 `.env` 파일을 만들거나 수정:

```env
VITE_PINATA_JWT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJlNGI2Y2VhOC02N2EwLTQ5MGUtYWMyMS1jNjg0MDYyMDFlMGEiLCJlbWFpbCI6InNpb24ucGFya0Bzb29rbXl1bmcuYWMua3IiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiYjg4MGVkZGM4ZWM1OGY0ODdmNmYiLCJzY29wZWRLZXlTZWNyZXQiOiI1ZWM2NThkYzI4ZTQyZjMzNmVmNTBlNWQyZTM5OTJmYzhlOWU1NjY2NTI1NGQwM2RhMzNiYWZlNThkMGQ1MzgwIiwiZXhwIjoxNzk0MTU2MTQzfQ.KUSIIylMqHfpZ4YepPhyUIuCBsJmJvLcA49j2NQhIV8
```

### Vercel 배포

1. Vercel 대시보드 → 프로젝트 선택
2. Settings → Environment Variables
3. 다음 변수 추가:
   - **Key**: `VITE_PINATA_JWT`
   - **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJlNGI2Y2VhOC02N2EwLTQ5MGUtYWMyMS1jNjg0MDYyMDFlMGEiLCJlbWFpbCI6InNpb24ucGFya0Bzb29rbXl1bmcuYWMua3IiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiYjg4MGVkZGM4ZWM1OGY0ODdmNmYiLCJzY29wZWRLZXlTZWNyZXQiOiI1ZWM2NThkYzI4ZTQyZjMzNmVmNTBlNWQyZTM5OTJmYzhlOWU1NjY2NTI1NGQwM2RhMzNiYWZlNThkMGQ1MzgwIiwiZXhwIjoxNzk0MTU2MTQzfQ.KUSIIylMqHfpZ4YepPhyUIuCBsJmJvLcA49j2NQhIV8`
   - **Environment**: Production, Preview, Development 모두 선택
4. Save

## 🧪 테스트

### 방법 1: 브라우저에서 테스트

`test-pinata-key.html` 파일을 브라우저에서 열고:
1. JWT Token 필드에 토큰 붙여넣기
2. "Test API Key" 버튼 클릭
3. 성공하면 ✅ 표시됨

### 방법 2: 실제 민팅 테스트

1. `.env` 파일에 JWT 토큰 설정
2. 개발 서버 재시작: `npm run dev`
3. NFT 민팅 시도
4. 콘솔에서 다음 로그 확인:
   ```
   📤 Uploading SVG to IPFS...
   ✅ SVG uploaded to IPFS: ipfs://Qm...
   📤 Uploading metadata to IPFS...
   ✅ Metadata uploaded to IPFS: ipfs://Qm...
   ```

## ⚠️ 주의사항

1. **JWT 토큰은 만료일이 있습니다!**
   - 현재 토큰의 만료일: `exp: 1794156143` (Unix timestamp)
   - 만료되면 새로 생성해야 합니다.

2. **토큰을 공개하지 마세요!**
   - GitHub에 커밋하지 마세요
   - `.env` 파일은 `.gitignore`에 포함되어 있어야 합니다

3. **환경 변수 변경 후 재시작 필요**
   - 개발 서버를 재시작해야 환경 변수가 적용됩니다

## ✅ 완료!

이제 NFT 민팅 시 자동으로 IPFS에 업로드되고, Basescan에서 이미지가 표시됩니다!

