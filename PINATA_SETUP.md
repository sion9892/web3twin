# Pinata API 키 발급 가이드

## 🔑 Pinata API 키 형식

Pinata API 키는 **3가지 형식**이 있습니다:

### 1. JWT 토큰 (추천 ⭐)
- **형식**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ...` (매우 긴 문자열)
- **길이**: 수백 자 이상
- **사용**: `Authorization: Bearer {JWT}` 헤더에 사용

### 2. API Key + Secret Key
- **API Key**: 32자리 영숫자 (예: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`)
- **Secret Key**: 64자리 영숫자 (예: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2`)
- **사용**: 각각 별도 헤더에 사용

## ❌ 잘못된 형식

다음 형식은 **Pinata 키가 아닙니다**:
- `0c53dba6.21ca95411d764afba8ed17ebc9a23295` ← 이건 NFT.Storage 키 형식입니다!

## ✅ 올바른 Pinata 키 발급 방법

### 방법 1: JWT 토큰 생성 (추천)

1. https://www.pinata.cloud/ 방문
2. 가입/로그인
3. 왼쪽 사이드바에서 **"API Keys"** 클릭
4. **"New Key"** 버튼 클릭
5. 키 이름 입력 (예: "Web3Twin")
6. 권한 설정:
   - ✅ `pinFileToIPFS` (파일 업로드)
   - ✅ `pinJSONToIPFS` (JSON 업로드)
7. **"Create Key"** 클릭
8. **JWT 토큰 복사** (한 번만 표시되므로 안전하게 보관!)
   - 형식: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (매우 긴 문자열)

### 방법 2: API Key + Secret Key 생성

1. 위와 동일하게 API Keys 페이지로 이동
2. "New Key" 클릭
3. 키 생성 후 **두 개의 키**가 표시됨:
   - **pinata_api_key**: 32자리 영숫자
   - **pinata_secret_api_key**: 64자리 영숫자

## 🔍 키 형식 확인

### Pinata JWT 토큰
- ✅ `eyJ`로 시작하는 매우 긴 문자열
- ✅ 점(.)으로 구분된 3부분
- ✅ 보통 200자 이상

### Pinata API Key
- ✅ 32자리 영숫자
- ✅ 대시(-) 없음
- ✅ 점(.) 없음

### Pinata Secret Key
- ✅ 64자리 영숫자
- ✅ 대시(-) 없음
- ✅ 점(.) 없음

## 📝 환경 변수 설정

### JWT 토큰 사용 (추천)
```env
VITE_PINATA_JWT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### API Key + Secret Key 사용
```env
VITE_PINATA_API_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
VITE_PINATA_SECRET_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

## ⚠️ 주의사항

1. **JWT 토큰은 한 번만 표시됩니다!** 복사해서 안전하게 보관하세요.
2. API 키는 **절대 공개하지 마세요!**
3. 키를 잃어버리면 새로 생성해야 합니다.
4. 무료 티어는 **1GB 저장 + 1GB 전송/월**입니다.

## 🧪 키 테스트

키를 설정한 후 민팅을 시도하면 콘솔에 다음 로그가 표시됩니다:
```
📤 Uploading SVG to IPFS...
✅ SVG uploaded to IPFS: ipfs://Qm...
📤 Uploading metadata to IPFS...
✅ Metadata uploaded to IPFS: ipfs://Qm...
```

만약 에러가 발생하면 키 형식이 잘못되었을 수 있습니다.

