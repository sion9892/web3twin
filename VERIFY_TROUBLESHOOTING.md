# Basescan 검증 문제 해결

## "Unable to locate Contract Code" 에러 해결

### 1. 컨트랙트 주소 확인

**정확한 컨트랙트 주소:**
```
0xbc0A506a658f3013AFB5941F37628d008306309B
```

⚠️ 주의: 주소가 잘려서 `0xbc0A506a658`로 보이면 안 됩니다!

### 2. Basescan에서 컨트랙트 존재 확인

1. **직접 주소로 접근:**
   ```
   https://basescan.org/address/0xbc0A506a658f3013AFB5941F37628d008306309B
   ```

2. **페이지가 열리는지 확인:**
   - 페이지가 열리면 컨트랙트가 존재함
   - "Contract" 탭이 보이는지 확인

3. **트랜잭션 확인:**
   - "Transactions" 탭에서 배포 트랜잭션 확인
   - 배포자가 `0xb4E59BB6A2C2864f731E228F358ef27Aa1B48DcA`인지 확인

### 3. 검증 페이지 접근 방법

#### 방법 1: 컨트랙트 페이지에서 직접
1. https://basescan.org/address/0xbc0A506a658f3013AFB5941F37628d008306309B 접속
2. "Contract" 탭 클릭
3. "Verify and Publish" 버튼 클릭

#### 방법 2: 검증 페이지 직접 접근
1. https://basescan.org/verifyContract 접속
2. "Contract Address" 필드에 **전체 주소** 입력:
   ```
   0xbc0A506a658f3013AFB5941F37628d008306309B
   ```
3. 나머지 설정 입력

### 4. 검증 설정

- **Compiler Type**: `Solidity (Single file)`
- **Compiler Version**: `v0.8.20+commit.a1b79de6`
- **License**: `MIT`
- **Optimization**: `Yes`
- **Runs**: `200`

### 5. 컨트랙트 코드

**파일**: `contracts/Web3TwinNFT_flattened_no_comments.sol`
- 주석 제거된 깨끗한 파일
- 1551줄
- 전체 내용 복사하여 붙여넣기

### 6. Constructor Arguments

**비워두기** (constructor에 인자가 없음)

## 문제 해결 체크리스트

- [ ] 컨트랙트 주소가 정확한지 확인 (전체 주소)
- [ ] Basescan에서 컨트랙트 페이지가 열리는지 확인
- [ ] "Contract" 탭이 보이는지 확인
- [ ] 검증 페이지에서 주소를 다시 입력했는지 확인
- [ ] 브라우저 캐시를 클리어했는지 확인

## 대안: Hardhat 자동 검증

수동 검증이 계속 실패하면 Hardhat 자동 검증을 사용하세요:

1. Basescan API 키 발급
2. `.env` 파일에 추가:
   ```env
   BASESCAN_API_KEY=your_api_key_here
   ```
3. 검증 실행:
   ```bash
   npx hardhat run scripts/verify-base.cjs --network base
   ```

