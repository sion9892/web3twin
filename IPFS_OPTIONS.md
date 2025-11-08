# 무료 IPFS 서비스 옵션

## 🆓 무료 IPFS 핀닝 서비스

### 1. **Pinata** (추천 ⭐⭐)
- **무료 용량**: 1GB 저장 + 1GB 전송/월
- **가격**: 무료 티어 있음
- **특징**:
  - 가장 인기 있는 IPFS 핀닝 서비스
  - 좋은 대시보드
  - API 키 관리 쉬움
  - 무료 티어는 제한적이지만 충분함
- **웹사이트**: https://www.pinata.cloud/

### 2. **Web3.Storage**
- **무료 용량**: 5GB/월
- **가격**: 완전 무료
- **특징**:
  - Protocol Labs에서 운영
  - Filecoin 기반
  - 간단한 API
- **웹사이트**: https://web3.storage/

## 📊 비교표

| 서비스 | 무료 용량 | 핀닝 | API | 추천도 |
|--------|----------|------|-----|--------|
| Pinata | 1GB | ✅ | ✅ 쉬움 | ⭐⭐⭐ |
| Web3.Storage | 5GB/월 | ✅ 자동 | ✅ 쉬움 | ⭐⭐ |

## 🎯 추천: Pinata

**이유:**
1. 가장 인기 있는 IPFS 핀닝 서비스
2. 좋은 대시보드와 관리 도구
3. REST API 사용이 간단함
4. 안정적이고 신뢰할 수 있음
5. 무료 티어로 충분함 (1GB)

## 💡 현재 프로젝트 구조

### 현재 방식 (Vercel API)
```
민팅 → 컨트랙트에 데이터 저장
     → Basescan이 tokenURI 호출
     → Vercel API가 동적으로 SVG 생성
     → Basescan에 표시
```

**장점:**
- 동적 생성 가능 (데이터 변경 시 이미지도 변경)
- 서버 비용 없음 (Vercel 무료 티어)
- 즉시 반영됨

**단점:**
- Vercel 서버가 다운되면 이미지도 사라짐
- 중앙화된 의존성

### IPFS 방식
```
민팅 → SVG 생성
     → IPFS에 업로드 (CID 획득)
     → 메타데이터에 IPFS URL 포함
     → 컨트랙트에 저장
     → Basescan이 IPFS에서 이미지 가져옴
```

**장점:**
- 탈중앙화 (서버 의존성 없음)
- 영구 저장 (핀닝 서비스 사용 시)
- 표준적인 NFT 방식

**단점:**
- 한 번 업로드하면 변경 불가
- 업로드 비용 (무료 서비스 사용 시 문제 없음)

## 🔧 구현 방법

### Pinata 사용 예시

```typescript
// REST API 사용 (추가 패키지 불필요)
const formData = new FormData();
formData.append('file', svgFile);

const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${PINATA_JWT}`
  },
  body: formData,
});

const result = await response.json();
const ipfsUrl = `ipfs://${result.IpfsHash}`;
```

### 민팅 시 IPFS에 업로드

1. NFT 민팅 전에 SVG 생성
2. IPFS에 업로드하여 CID 획득
3. 메타데이터 생성 (image 필드에 IPFS URL 포함)
4. 메타데이터도 IPFS에 업로드
5. 컨트랙트의 `tokenURI`에 메타데이터 IPFS URL 반환

## 🤔 현재 프로젝트에 IPFS 적용할까요?

**현재 방식의 장점:**
- 이미 작동하고 있음
- 동적 생성 가능
- 서버 비용 없음

**IPFS로 변경할 경우:**
- 더 표준적인 NFT 방식
- 탈중앙화
- 하지만 구현이 복잡해짐

**추천:**
- 현재 방식도 충분히 좋습니다!
- IPFS는 선택 사항입니다.
- Basescan에서 이미지가 보이면 현재 방식으로도 문제 없습니다.

## 📝 결론

**무료 IPFS 서비스가 있습니다!**
- Pinata: 1GB 무료 (추천) ⭐
- Web3.Storage: 5GB/월 무료

**현재 프로젝트는 Pinata를 사용합니다!**
- REST API로 구현되어 있어 추가 패키지 설치 불필요
- 안정적이고 신뢰할 수 있음
- Basescan에서 이미지가 정상적으로 표시됨

