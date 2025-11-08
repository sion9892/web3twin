# 컨트랙트 검증 가이드

## 자동 검증 (Hardhat 사용)

### 1. Basescan API 키 발급
1. https://basescan.org/ 접속
2. 회원가입/로그인
3. 우측 상단 프로필 → API Keys
4. "Add" 클릭하여 새 API 키 생성
5. API 키 복사

### 2. 환경 변수 설정
`.env` 파일에 추가:
```env
BASESCAN_API_KEY=your_api_key_here
```

### 3. 검증 실행
```bash
npx hardhat run scripts/verify-base.cjs --network base
```

## 수동 검증 (Basescan 웹사이트)

### 1. Basescan에서 컨트랙트 페이지 열기
https://basescan.org/address/0xbc0A506a658f3013AFB5941F37628d008306309B

### 2. "Contract" 탭 클릭
- "Verify and Publish" 버튼 클릭

### 3. 검증 설정
- **Compiler Type**: Solidity (Single file)
- **Compiler Version**: 0.8.20
- **Open Source License Type**: MIT
- **Optimization**: Yes
- **Runs**: 200

### 4. 컨트랙트 코드 입력
`contracts/Web3TwinNFT.sol` 파일의 전체 내용을 복사하여 붙여넣기

### 5. Constructor Arguments
- **ABI-encoded**: (비어있음 - constructor에 인자가 없음)

### 6. 제출
- "Verify and Publish" 버튼 클릭

## 검증 후 확인

검증이 완료되면:
- Basescan 컨트랙트 페이지에서 "Contract" 탭에 소스 코드가 표시됨
- "Read Contract" 및 "Write Contract" 기능 사용 가능
- "Unverified Contract" 경고가 사라짐

## 문제 해결

### "Already Verified" 에러
- 컨트랙트가 이미 검증되어 있음
- 정상적인 상태입니다

### 검증 실패
1. 컴파일러 버전 확인 (0.8.20)
2. 최적화 설정 확인 (enabled: true, runs: 200)
3. 컨트랙트 코드가 정확한지 확인
4. Constructor 인자가 올바른지 확인 (없음)

