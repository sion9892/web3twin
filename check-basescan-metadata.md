# Basescan에서 NFT 메타데이터 확인 방법

## 방법 1: Basescan 웹사이트에서 확인

### 단계별 가이드

1. **NFT 페이지에서 Contract Address 확인**
   - Basescan NFT 페이지에서 "Contract Address" 클릭
   - 예: `0xbc0A506a658f3013AFB5941F37628d008306309B`

2. **컨트랙트 페이지로 이동**
   - Contract Address를 클릭하면 컨트랙트 페이지로 이동

3. **Read Contract 탭 클릭**
   - 컨트랙트 페이지에서 "Contract" 탭 → "Read Contract" 클릭

4. **tokenURI 함수 호출**
   - `tokenURI` 함수 찾기
   - Token ID 입력 (예: 16)
   - "Query" 또는 "Read" 버튼 클릭
   - 반환된 URL 확인 (예: `ipfs://Qm...` 또는 `https://...`)

5. **메타데이터 확인**
   - 반환된 URL을 브라우저에서 열기
   - 메타데이터 JSON 확인
   - `image` 필드 형식 확인

## 방법 2: 직접 URL로 접근

### Basescan API 사용

```
https://api.basescan.org/api?module=proxy&action=eth_call&to=0xbc0A506a658f3013AFB5941F37628d008306309B&data=0xc87b56dd0000000000000000000000000000000000000000000000000000000000000010&tag=latest&apikey=YourApiKeyToken
```

위 URL에서:
- `to`: 컨트랙트 주소
- `data`: `tokenURI(uint256)` 함수 호출 데이터 (Token ID 16 = 0x10)
- `0xc87b56dd`: `tokenURI(uint256)` 함수 시그니처

### 직접 확인 (간단한 방법)

1. Basescan NFT 페이지 URL 예시:
   ```
   https://basescan.org/nft/0xbc0A506a658f3013AFB5941F37628d008306309B/16
   ```

2. 페이지 소스 보기 또는 개발자 도구에서:
   - F12 → Network 탭
   - 페이지 새로고침
   - API 호출 확인

## 방법 3: 컨트랙트 직접 읽기

### Web3 도구 사용

1. **Basescan에서 직접 읽기**
   - Contract 페이지 → Read Contract → tokenURI

2. **Etherscan/Basescan API 사용**
   - API 키 필요
   - `eth_call` 메서드 사용

## 확인할 사항

메타데이터 JSON에서 확인:
```json
{
  "name": "...",
  "description": "...",
  "image": "https://gateway.pinata.cloud/ipfs/Qm..."  // ← 이 부분!
}
```

- `image` 필드가 `https://`로 시작하면 → 정상
- `image` 필드가 `ipfs://`로 시작하면 → Basescan에서 표시 안 됨

## 빠른 확인 방법

1. Basescan NFT 페이지 열기
2. F12 (개발자 도구) 열기
3. Console 탭에서 다음 실행:
   ```javascript
   // 컨트랙트 주소와 Token ID 설정
   const contractAddress = '0xbc0A506a658f3013AFB5941F37628d008306309B';
   const tokenId = 16;
   
   // Web3 provider 사용 (Basescan이 이미 로드한 경우)
   // 또는 직접 API 호출
   ```

4. Network 탭에서 메타데이터 요청 확인

