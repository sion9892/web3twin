# Basescan 검증 - 깨끗한 Flatten 파일 사용

## 문제 해결
npm warn 메시지와 dotenv 메시지를 제거한 깨끗한 flatten 파일을 생성했습니다.

## 사용할 파일
**`contracts/Web3TwinNFT_flattened_clean.sol`** ← 이 파일을 사용하세요!

## 검증 단계

### 1. Basescan에서 검증 페이지 열기
**정확한 컨트랙트 주소 확인:**
```
https://basescan.org/address/0xbc0A506a658f3013AFB5941F37628d008306309B
```

⚠️ 주소가 잘려서 `0xbc0A506a658`로 보이면 안 됩니다. 전체 주소를 확인하세요!

### 2. "Contract" 탭 → "Verify and Publish" 클릭

### 3. 검증 설정
- **Compiler Type**: `Solidity (Single file)`
- **Compiler Version**: `v0.8.20+commit.a1b79de6`
- **License**: `MIT`
- **Optimization**: `Yes`
- **Runs**: `200`

### 4. 컨트랙트 코드 입력
1. **`contracts/Web3TwinNFT_flattened_clean.sol`** 파일 열기
2. **전체 내용 복사** (Ctrl+A 또는 Cmd+A → Ctrl+C 또는 Cmd+C)
3. Basescan의 텍스트 영역에 **전체 내용 붙여넣기**
   - 기존 코드는 모두 삭제하고 새로 붙여넣기
   - npm warn 메시지가 없어야 합니다

### 5. Constructor Arguments
- **비워두기** (constructor에 인자가 없음)

### 6. "Verify and Publish" 클릭

## 확인 사항

### 파일이 올바른지 확인
파일의 첫 줄이 다음과 같이 시작해야 합니다:
```solidity
// Sources flattened with hardhat v2.26.5 https://hardhat.org

// SPDX-License-Identifier: MIT
```

❌ 다음이 있으면 안 됩니다:
- `npm warn config`
- `[dotenv@17.2.3]`

### 컨트랙트 주소 확인
전체 주소: `0xbc0A506a658f3013AFB5941F37628d008306309B`

## 문제 해결

### "Unable to locate Contract Code" 에러
1. 컨트랙트 주소가 정확한지 확인
2. Base 네트워크에 배포되었는지 확인
3. 컨트랙트가 실제로 존재하는지 확인

### 여전히 에러가 발생하면
1. Basescan 페이지를 새로고침
2. 다른 브라우저에서 시도
3. Standard JSON Input 방식 사용 고려

