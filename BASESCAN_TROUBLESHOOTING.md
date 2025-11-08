# Basescan NFT 이미지 표시 문제 해결

## 🔍 문제 진단

### 1단계: 컨트랙트 주소 확인
현재 배포된 컨트랙트 주소: `0xbc0A506a658f3013AFB5941F37628d008306309B`

Basescan에서 확인한 Contract Address와 일치하는지 확인하세요.

### 2단계: tokenURI 확인
1. Basescan에서 NFT 페이지 열기
2. Contract Address 클릭 → 컨트랙트 페이지로 이동
3. "Contract" 탭 → "Read Contract" 클릭
4. `tokenURI` 함수에 Token ID 입력 (예: 16)
5. 반환된 URL 확인

### 3단계: 메타데이터 확인
tokenURI가 `ipfs://Qm...` 형식이면:
- 브라우저에서 `https://gateway.pinata.cloud/ipfs/Qm...` 접속
- 메타데이터 JSON 확인

메타데이터에서 확인할 사항:
```json
{
  "name": "...",
  "description": "...",
  "image": "https://gateway.pinata.cloud/ipfs/Qm..."  // ← 이 부분 확인!
}
```

## 🐛 가능한 문제들

### 문제 1: 이전에 민팅된 NFT
- **증상**: Token ID 16이 변경사항 적용 전에 민팅됨
- **원인**: 메타데이터가 이미 `ipfs://` 형식으로 저장됨
- **해결**: 새로 민팅한 NFT에서만 작동 (기존 NFT는 변경 불가)

### 문제 2: 메타데이터의 image 필드가 ipfs:// 형식
- **증상**: 메타데이터의 `image` 필드가 `ipfs://Qm...` 형식
- **원인**: 변경사항이 적용되지 않았거나, 이전에 민팅된 NFT
- **해결**: 새로 민팅한 NFT에서만 작동

### 문제 3: Basescan 캐시
- **증상**: 메타데이터는 올바른데 Basescan에 표시 안 됨
- **원인**: Basescan이 메타데이터를 캐시함
- **해결**: 몇 시간 후 다시 확인하거나, Basescan에 문의

### 문제 4: IPFS 게이트웨이 문제
- **증상**: 메타데이터는 올바른데 이미지가 로드 안 됨
- **원인**: IPFS 게이트웨이가 느리거나 다운됨
- **해결**: 다른 게이트웨이 사용 (ipfs.io, cloudflare-ipfs.com 등)

## ✅ 해결 방법

### 방법 1: 새 NFT 민팅 (가장 확실)
1. 새로 NFT 민팅
2. 민팅 시 콘솔에서 다음 로그 확인:
   ```
   📝 Metadata image URL (HTTP gateway): https://gateway.pinata.cloud/ipfs/...
   ```
3. Basescan에서 새 NFT 확인

### 방법 2: 메타데이터 직접 확인
1. Basescan에서 tokenURI 확인
2. 메타데이터 JSON 다운로드
3. `image` 필드 형식 확인
4. HTTP URL이면 정상, `ipfs://`면 이전 NFT

### 방법 3: IPFS 게이트웨이 변경
현재 코드는 `gateway.pinata.cloud`를 사용합니다.
다른 게이트웨이로 변경 가능:
- `https://ipfs.io/ipfs/...`
- `https://cloudflare-ipfs.com/ipfs/...`
- `https://dweb.link/ipfs/...`

## 📝 확인 체크리스트

- [ ] 이 NFT가 언제 민팅되었는지 확인
- [ ] tokenURI가 무엇인지 확인
- [ ] 메타데이터의 image 필드 형식 확인
- [ ] 새로 민팅한 NFT인지 확인
- [ ] Basescan 캐시 문제인지 확인

## 🆘 여전히 안 되면

1. **새 NFT 민팅**: 가장 확실한 방법
2. **메타데이터 확인**: 실제 메타데이터 내용 확인
3. **Basescan 문의**: Basescan 지원팀에 문의

