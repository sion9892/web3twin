# Pinata API Key 문제 해결

## 🔍 현재 상황

- API Key: `c966cd64e803e9260a47` ✅ (있음)
- Secret Key: ❌ (없음)
- JWT Token: ❌ (없음)

## 📋 Pinata 대시보드에서 확인할 곳

### 방법 1: API Keys 페이지에서 View 클릭

1. https://www.pinata.cloud/ 로그인
2. 왼쪽 사이드바 → **"API Keys"** 클릭
3. 생성한 키 목록에서 키를 찾기
4. 키 옆에 **"View"** 또는 **"..."** (더보기) 버튼 클릭
5. 여기서 Secret Key나 JWT를 확인할 수 있어야 함

### 방법 2: 새 키 생성 시 확인

1. **"New Key"** 버튼 클릭
2. 키 이름 입력
3. 권한 설정:
   - ✅ `pinFileToIPFS`
   - ✅ `pinJSONToIPFS`
4. **"Create Key"** 클릭
5. **키 생성 후 즉시 표시되는 화면**에서:
   - API Key
   - Secret Key (또는 API Secret)
   - JWT Token (있는 경우)
   
   **⚠️ 중요: 이 화면은 한 번만 표시됩니다!** 복사해서 안전하게 보관하세요.

### 방법 3: Pinata 최신 인터페이스

Pinata가 최근 인터페이스를 변경했을 수 있습니다:
- **"Keys"** 메뉴
- **"Credentials"** 메뉴
- **"Settings" → "API"** 메뉴

## 🔄 대안: Web3.Storage 사용

Pinata 키를 찾기 어렵다면, Web3.Storage를 사용할 수 있습니다:

1. https://web3.storage/ 방문
2. 가입 후 API 토큰 생성
3. 더 간단한 API

## 🧪 현재 API Key로 테스트

현재 API Key만으로도 작동하는지 테스트해볼 수 있습니다:

1. `test-pinata-key.html` 파일을 브라우저에서 열기
2. API Key 필드에 `c966cd64e803e9260a47` 입력
3. Secret Key는 비워두고 테스트
4. 작동하지 않으면 Secret Key가 필요함

## 💡 해결 방법

### 옵션 1: Pinata 지원팀에 문의
- support@pinata.cloud
- 또는 대시보드의 "Help" 메뉴

### 옵션 2: 새 키 생성
- 기존 키를 삭제하고 새로 생성
- 생성 시 모든 정보를 복사

### 옵션 3: Web3.Storage로 전환
- 더 간단한 API
- 무료 5GB/월

