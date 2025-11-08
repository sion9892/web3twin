# Basescan API 키 발급 방법

## 자동 검증을 위한 API 키 발급

### 1단계: Basescan 회원가입/로그인
1. https://basescan.org/ 접속
2. 우측 상단 "Sign In" 클릭
3. 회원가입 또는 로그인

### 2단계: API 키 생성
1. 로그인 후 우측 상단 프로필 아이콘 클릭
2. "API-KEYs" 또는 "API Keys" 메뉴 선택
3. "Add" 또는 "+" 버튼 클릭
4. API 키 이름 입력 (예: "Web3Twin")
5. "Create" 클릭
6. 생성된 API 키 복사

### 3단계: 환경 변수 설정
`.env` 파일에 추가:
```env
BASESCAN_API_KEY=your_api_key_here
```

### 4단계: 자동 검증 실행
```bash
npx hardhat run scripts/verify-base.cjs --network base
```

## API 키 없이 검증하기

API 키가 없으면 수동 검증을 사용하세요:
1. `flattened-contracts/Web3TwinNFT_flattened_no_comments.sol` 파일 사용
2. Basescan 웹사이트에서 수동 검증

