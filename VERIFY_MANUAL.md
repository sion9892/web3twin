# Basescan 수동 검증 가이드 (OpenZeppelin Import 문제 해결)

## 문제
"Unable to connect to the remote server" 에러는 OpenZeppelin import를 Basescan이 직접 처리하지 못해서 발생합니다.

## 해결 방법: Flatten 파일 사용

### 1. Flatten 파일 확인
`contracts/Web3TwinNFT_flattened.sol` 파일이 생성되었습니다.
이 파일에는 모든 OpenZeppelin 컨트랙트가 포함되어 있습니다.

### 2. Basescan에서 검증

1. **Basescan 컨트랙트 페이지 열기**
   ```
   https://basescan.org/address/0xbc0A506a658f3013AFB5941F37628d008306309B
   ```

2. **"Contract" 탭 → "Verify and Publish" 클릭**

3. **검증 설정**
   - **Compiler Type**: `Solidity (Single file)`
   - **Compiler Version**: `v0.8.20+commit.a1b79de6`
   - **License**: `MIT`
   - **Optimization**: `Yes`
   - **Runs**: `200`

4. **컨트랙트 코드 입력**
   - `contracts/Web3TwinNFT_flattened.sol` 파일을 열기
   - 전체 내용 복사 (약 3951줄)
   - Basescan의 텍스트 영역에 붙여넣기

5. **Constructor Arguments**
   - 비워두기 (constructor에 인자가 없음)

6. **"Verify and Publish" 클릭**

### 3. 대안: Standard JSON Input 방식

만약 Single file 방식이 실패하면:

1. **Compiler Type**: `Solidity (Standard JSON Input)` 선택
2. Hardhat에서 Standard JSON 생성:
   ```bash
   npx hardhat compile --force
   ```
3. `artifacts/build-info/` 폴더에서 JSON 파일 찾기
4. Basescan에 업로드

## 주의사항

- Flatten 파일은 매우 큽니다 (약 3951줄)
- 복사/붙여넣기 시 시간이 걸릴 수 있습니다
- 브라우저가 멈출 수 있으니 인내심이 필요합니다

## 검증 후 확인

검증이 완료되면:
- "Contract" 탭에서 소스 코드 확인 가능
- "Read Contract" 및 "Write Contract" 기능 사용 가능
- "Unverified Contract" 경고가 사라짐

