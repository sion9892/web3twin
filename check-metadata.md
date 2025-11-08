# NFT 메타데이터 확인 방법

## Basescan에서 메타데이터 확인

1. Basescan에서 NFT 페이지 열기
2. "Details" 섹션에서 "Contract Address" 확인
3. Contract Address를 클릭하여 컨트랙트 페이지로 이동
4. "Contract" 탭 → "Read Contract" 클릭
5. `tokenURI` 함수에 Token ID `16` 입력
6. 반환된 IPFS URL 확인

## 메타데이터 직접 확인

tokenURI가 `ipfs://Qm...` 형식이면:
- 브라우저에서 `https://gateway.pinata.cloud/ipfs/Qm...` 접속
- 또는 `https://ipfs.io/ipfs/Qm...` 접속

메타데이터 JSON에서 `image` 필드 확인:
- `ipfs://` 형식이면 → Basescan이 표시하지 못함
- `https://gateway.pinata.cloud/ipfs/...` 형식이면 → 정상

## 문제 해결

### 경우 1: 이전에 민팅된 NFT (변경사항 적용 전)
- 메타데이터가 이미 `ipfs://` 형식으로 저장됨
- 해결: 새로 민팅한 NFT에서만 작동

### 경우 2: 새로 민팅한 NFT인데도 안 보임
- 메타데이터 확인 필요
- IPFS 게이트웨이 문제일 수 있음
- Basescan 캐시 문제일 수 있음

## 확인 사항

1. 이 NFT가 언제 민팅되었는지?
2. tokenURI가 무엇인지?
3. 메타데이터의 image 필드 형식은?

