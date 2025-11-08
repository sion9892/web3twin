# Web3Twin 피치덱 목차 및 내용 가이드

## 📋 슬라이드 구성 (총 10-12장, 5분 이내)

---

### 1️⃣ 표지 슬라이드
**내용:**
- 프로젝트명: **Web3Twin**
- 부제: "Farcaster에서 당신의 트윈을 찾아보세요"
- 로고/비주얼
- 주최: 대한 베이스 & 이대 학회
- 날짜

**디자인 팁:** Base 브랜드 컬러 활용, 현대적이고 친근한 느낌

---

### 2️⃣ 문제 정의 (Problem Statement)
**내용:**
- **소셜 임팩트 강조**
- Farcaster 커뮤니티에서 비슷한 관심사와 분위기를 가진 사람을 찾기 어려움
- 온라인에서 진정한 연결을 만들고 싶지만 방법이 제한적
- Web3에서 의미 있는 소셜 경험을 만들어내는 도전

**핵심 메시지:** "같은 분위기의 사람을 찾고 싶지만, 어떻게 찾을까?"

---

### 3️⃣ 솔루션 소개 (Solution)
**내용:**
- **Base 이해도 강조**
- Web3Twin: 최근 캐스트를 데이터 기반 알고리즘으로 분석하여 가장 비슷한 분위기의 사용자를 매칭
- 4단계 간단한 플로우로 누구나 쉽게 사용 가능
- Base Smart Wallet을 통한 원클릭 NFT 민팅

**핵심 메시지:** "당신의 캐스트로 트윈을 찾고, NFT로 영원히 기록하세요"

---

### 4️⃣ 핵심 기능 (Key Features)
**내용:**
- **Base 이해도 강조**
  1. **Farcaster 캐스트 분석**: 최근 25개 캐스트를 텍스트, 해시태그, 이모지로 분석
  2. **데이터 기반 매칭 알고리즘**: 
     - 60% 텍스트 유사도 (Jaccard Similarity - 수학적 집합 연산)
     - 25% 해시태그 겹침 (Overlap Coefficient)
     - 15% 이모지 패턴 분석 (Overlap Coefficient)
     - 가중치 기반 점수 계산으로 가장 유사한 사용자 매칭
  3. **Base Smart Wallet 통합**: 
     - 브라우저 확장 프로그램 불필요
     - 가스비 최적화 ($0.001-$2.0)
     - 원클릭 지갑 생성 및 민팅
  4. **온체인 NFT 배지**: 
     - Base 네트워크에 ERC721 NFT로 영구 저장
     - 트윈 매칭 결과를 시각화한 SVG NFT
     - 공유 가능한 온체인 증명

**시각적 요소:** 스크린샷 또는 다이어그램

---

### 5️⃣ 기술 스택 & Base 활용도
**내용:**
- **Base 이해도 강조 (40% 평가 항목)**
- **Base 네트워크 활용:**
  - **Base Smart Wallet (Account Abstraction)**
    - ERC-4337 표준 기반 스마트 계정
    - 브라우저 확장 프로그램 불필요
    - 원클릭 지갑 생성 및 트랜잭션
    - wagmi의 `baseAccount` 커넥터 통합
  - **Base L2 네트워크 배포**
    - Chain ID: 8453 (Base Mainnet)
    - OP Stack 기반 Optimistic Rollup
    - 가스비 100배 이상 절감 ($0.001-$2.0)
    - Ethereum 보안성 상속
  - **ERC721 NFT 컨트랙트**
    - OpenZeppelin 라이브러리 기반
    - 컨트랙트 주소: `0x9896849284779B561fbE4420F56b93a46b2efB39`
    - Hardhat으로 Base 메인넷 배포
  - 온체인 메타데이터 저장
  
- **기술 스택:**
  - Frontend: React + TypeScript + Vite
  - Blockchain: Base Smart Wallet (wagmi/viem)
  - API: Neynar REST API v2 (Farcaster)
  - Smart Contract: Solidity 0.8.20 (Hardhat)
  - Deployment: Vercel (Serverless)

**핵심 메시지:** "Base의 모든 핵심 기능을 활용하여 사용자 경험을 극대화했습니다"
**기술적 강조:**
- Base Smart Wallet의 Account Abstraction으로 Web3 진입 장벽 제거
- Base L2의 저렴한 가스비로 실제 사용 가능한 NFT 민팅
- Ethereum 호환성으로 기존 도구(wagmi, viem, Hardhat) 그대로 활용

---

### 6️⃣ 데모 비디오 (1분 30초)
**내용:**
- 실제 사용 플로우 시연
- 핸들 입력 → 분석 → 매칭 결과 → NFT 민팅 → 공유
- Base Smart Wallet 연결 과정 강조
- NFT 민팅 성공 화면

**팁:** 화면 녹화 + 음성 설명 또는 자막

---

### 7️⃣ 소셜 임팩트 (Social Impact)
**내용:**
- **소셜 임팩트 강조 (40% 평가 항목)**
- **커뮤니티 연결 강화:**
  - Farcaster 사용자들이 서로를 발견하고 연결할 수 있는 새로운 방법 제공
  - 공통 관심사 기반의 의미 있는 관계 형성
  - Web3 네이티브한 소셜 경험 창출

- **접근성 향상:**
  - Base Smart Wallet로 Web3 진입 장벽 제거
  - 복잡한 시드구문 없이 지갑 생성 가능
  - 저렴한 가스비로 누구나 NFT 민팅 가능

- **온체인 증명:**
  - 트윈 매칭을 NFT로 영구 기록
  - 블록체인에 저장된 소셜 연결의 증거
  - 공유 가능한 디지털 배지

**핵심 메시지:** "Web3에서 진정한 소셜 연결을 만들어갑니다"

---

### 8️⃣ 커뮤니티 참여도 (Community Engagement)
**내용:**
- **커뮤니티 투표 강조 (20% 평가 항목)**
- **온라인 참여 지표:**
  - 웹사이트: https://web3twin.vercel.app/
  - GitHub: 오픈소스 프로젝트 (MIT License)
  - Farcaster에서의 공유 및 리트윗
  - Base 커뮤니티 내 피드백 수집

- **향후 계획:**
  - 커뮤니티 피드백 반영
  - 다국어 지원 확대
  - 팔로워/팔로잉 네트워크 분석 확장
  - NFT 마켓플레이스 통합

**핵심 메시지:** "커뮤니티와 함께 성장하는 프로젝트"

---

### 9️⃣ 차별화 포인트 (Differentiation)
**내용:**
- **Base 이해도 강조**
- 다른 프로젝트와의 차별점:
  1. **Base Smart Wallet 완전 통합**: 
     - Account Abstraction (ERC-4337)을 활용한 최적의 UX
     - 지갑 확장 프로그램 없이 원클릭 사용
     - Base의 혁신적인 Web3 진입 경험 제공
  2. **온체인 NFT 증명**: 
     - Base 메인넷에 ERC721 NFT로 영구 저장
     - OpenZeppelin 기반의 검증된 보안 패턴
     - 블록체인에 저장된 소셜 연결의 증거
  3. **통계 기반 매칭 알고리즘**: 
     - 단순 팔로워 수가 아닌 실제 콘텐츠 기반 매칭
     - 텍스트, 해시태그, 이모지 다차원 분석
     - Jaccard Similarity와 Overlap Coefficient 등 수학적 유사도 측정
  4. **실제 사용 가능한 비용**: 
     - Base의 저렴한 가스비 ($0.001-$2.0)
     - Ethereum 대비 100배 이상 절감
     - 일반 사용자도 부담 없이 NFT 민팅 가능

**핵심 메시지:** "Base의 강점을 최대한 활용한 Web3 네이티브 솔루션"
**기술적 차별화:**
- 단순히 Base를 사용한 것이 아니라, 컨트랙트 배포부터 Smart Wallet 통합까지 완전 구현
- Base의 핵심 가치(접근성, 저렴한 가스비, 보안성)를 실제 사용자 경험으로 구현

---

### 🔟 로드맵 (Roadmap)
**내용:**
- **단기 (1-2개월):**
  - 다국어 지원 (한국어, 영어)
  - 팔로워/팔로잉 네트워크 분석 확장
  - 유사도 알고리즘 고도화

- **중기 (3-6개월):**
  - NFT 마켓플레이스 통합
  - 그룹 매칭 기능 (3명 이상)
  - Farcaster 프레임 통합

- **장기 (6개월+):**
  - 다른 소셜 프로토콜 확장
  - DAO 거버넌스 도입
  - 커뮤니티 주도 개발

---

### 1️⃣1️⃣ 팀 소개 (Team)
**내용:**
- 개발자 소개 (간단히)
- Base Korea 커뮤니티 멤버
- 이대 학회 참여자

**팁:** 개인 정보는 최소화하고 프로젝트에 집중

---

### 1️⃣2️⃣ 마무리 & CTA (Call to Action)
**내용:**
- **커뮤니티 투표 강조**
- "지금 바로 Web3Twin을 체험해보세요!"
- 웹사이트: https://web3twin.vercel.app/
- Farcaster에서 공유 및 피드백 부탁드립니다
- Base 커뮤니티 투표 부탁드립니다

**핵심 메시지:** "여러분의 투표와 피드백이 프로젝트를 성장시킵니다"

---

## 📊 평가 기준별 강조 포인트

### Base 이해도 (40%)
- ✅ Base Smart Wallet (Account Abstraction) 활용
- ✅ Base L2 네트워크 배포 및 가스비 최적화
- ✅ ERC721 NFT 컨트랙트 온체인 배포
- ✅ wagmi/viem을 통한 Base 통합
- ✅ Base의 핵심 가치(접근성, 저렴한 가스비) 활용

### Social Impact (40%)
- ✅ Farcaster 커뮤니티 연결 강화
- ✅ Web3 진입 장벽 제거 (Base Smart Wallet)
- ✅ 의미 있는 소셜 경험 창출
- ✅ 온체인 증명을 통한 디지털 신원 강화
- ✅ 접근성 향상 (저렴한 가스비, 쉬운 UX)

### Community Voting (20%)
- ✅ 오픈소스 프로젝트 (GitHub)
- ✅ Farcaster에서의 공유 및 리트윗
- ✅ Base 커뮤니티 피드백 수집
- ✅ 지속적인 커뮤니티 참여 계획

---

## 🎨 디자인 가이드라인

1. **색상:** Base 브랜드 컬러 (파란색 계열) + 보라색 액센트
2. **폰트:** 깔끔하고 읽기 쉬운 산세리프 폰트
3. **이미지:** 스크린샷, 다이어그램, 아이콘 활용
4. **레이아웃:** 한 슬라이드에 하나의 핵심 메시지
5. **애니메이션:** 최소화 (PDF이므로 정적 이미지)

---

## ⏱️ 시간 배분 (총 5분)

- 표지: 10초
- 문제 정의: 30초
- 솔루션 소개: 30초
- 핵심 기능: 45초
- 기술 스택 & Base 활용도: 45초
- **데모 비디오: 1분 30초** (고정)
- 소셜 임팩트: 30초
- 커뮤니티 참여도: 20초
- 차별화 포인트: 20초
- 로드맵: 15초
- 팀 소개: 10초
- 마무리 & CTA: 15초

**총 발표 시간: 약 3분 30초 + 데모 비디오 1분 30초 = 5분**

---

## 💡 발표 팁

1. **Base 이해도 강조:** 
   - 기술적 세부사항을 명확히 설명 (Account Abstraction, OP Stack, Optimistic Rollup)
   - Base Smart Wallet의 혁신성 강조 (Web3 진입 장벽 제거)
   - 실제 구현 내용 언급 (컨트랙트 배포, wagmi 통합, 가스비 최적화)
   - Base의 핵심 가치(접근성, 저렴한 가스비, 보안성)를 구체적인 수치로 설명
   
2. **소셜 임팩트 강조:** 
   - 사용자 스토리와 실제 활용 사례 언급
   - Base Smart Wallet로 Web3 진입 장벽이 어떻게 제거되었는지 설명
   - 저렴한 가스비로 누구나 접근 가능하다는 점 강조
   
3. **커뮤니티 참여 유도:** 
   - 발표 중간과 끝에 투표 및 피드백 요청
   - Base 커뮤니티와의 연결 강조
   
4. **데모 비디오:** 
   - 실제 사용 플로우를 보여주며 Base Smart Wallet의 편리함 강조
   - 지갑 확장 프로그램 없이 원클릭으로 NFT 민팅되는 과정 시연
   - BaseScan에서 트랜잭션 확인하는 장면 포함
   
5. **열정:** 
   - 프로젝트에 대한 진정성과 Base 생태계에 대한 이해 보여주기
   - Base의 기술적 우수성을 실제 구현으로 증명했다는 자신감 표현

### 🎤 발표 시 핵심 메시지 (반드시 언급)

1. **"Base Smart Wallet의 Account Abstraction으로 Web3 진입 장벽을 완전히 제거했습니다"**
   - 지갑 확장 프로그램 불필요
   - 복잡한 시드구문 관리 불필요
   - 원클릭 지갑 생성 및 트랜잭션

2. **"Base L2의 저렴한 가스비로 실제 사용 가능한 NFT 민팅을 구현했습니다"**
   - $0.001-$2.0 수준의 저렴한 비용
   - Ethereum 대비 100배 이상 절감
   - 일반 사용자도 부담 없이 사용 가능

3. **"Base의 Ethereum 호환성으로 기존 도구를 그대로 활용했습니다"**
   - wagmi, viem, Hardhat 등 기존 도구 활용
   - OpenZeppelin의 검증된 보안 패턴 사용
   - EVM 호환으로 개발 생산성 향상

4. **"Base의 보안성을 신뢰하여 소셜 연결을 NFT로 영구 저장합니다"**
   - Ethereum의 보안성 상속
   - Optimistic Rollup의 Fraud Proof 시스템
   - 온체인 증명으로 영구 보존

### ⚠️ 질문 대응 전략

- **기술적 질문이 나오면:** Q&A 섹션의 답변을 참고하여 자신 있게 답변
- **모르는 질문이 나오면:** "좋은 질문입니다. 제가 정확히 확인하고 답변드리겠습니다"라고 하며 Q&A 섹션 참고
- **비교 질문이 나오면:** Base의 차별점(Coinbase 지원, Base Smart Wallet, OP Stack) 강조
- **구현 관련 질문이 나오면:** 실제 코드와 컨트랙트 주소를 언급하며 구체적으로 설명

---

## 📝 체크리스트

- [ ] 모든 슬라이드에 Base 브랜딩 일관성 유지
- [ ] 평가 기준 3가지 모두 명확히 언급
- [ ] 데모 비디오 1분 30초 준비 완료
- [ ] 웹사이트 URL 및 GitHub 링크 포함
- [ ] 한글로 작성 (주최측: 대한 베이스 & 이대 학회)
- [ ] PDF 형식으로 변환
- [ ] 발표 연습 (시간 체크)

---

## 🎯 Base 이해도 Q&A (발표 대비 필수)

### 기본 개념 질문

#### Q1: Base가 무엇인가요?
**답변:**
- Base는 Coinbase가 개발한 Ethereum Layer 2 (L2) 블록체인입니다
- OP Stack을 기반으로 구축된 Optimistic Rollup 솔루션입니다
- Ethereum의 보안성을 유지하면서 가스비를 100배 이상 절감합니다
- Chain ID: 8453 (메인넷), 84532 (테스트넷 Sepolia)
- **우리 프로젝트에서:** Base 메인넷(8453)에 ERC721 NFT 컨트랙트를 배포하여 사용합니다

#### Q2: 왜 Base를 선택했나요?
**답변:**
- **저렴한 가스비**: Ethereum 대비 100배 이상 저렴하여 일반 사용자도 NFT 민팅 가능 ($0.001-$2.0)
- **빠른 트랜잭션**: L2의 빠른 블록 생성 시간으로 즉각적인 NFT 민팅 경험 제공
- **Base Smart Wallet**: Account Abstraction을 통한 Web3 진입 장벽 제거
- **Ethereum 호환성**: EVM 호환으로 기존 도구(wagmi, viem, Hardhat) 그대로 사용 가능
- **생태계 성장**: Coinbase의 지원과 활발한 개발자 커뮤니티

#### Q3: Base와 Ethereum의 관계는?
**답변:**
- Base는 Ethereum의 Layer 2로, Ethereum의 보안성을 상속받습니다
- 트랜잭션 데이터는 Base에서 처리되지만, 최종 상태는 Ethereum 메인넷에 저장됩니다
- Optimistic Rollup 방식: 트랜잭션을 배치로 묶어서 Ethereum에 제출하고, 이의가 없으면 승인
- **우리 프로젝트:** Base에서 NFT를 민팅하지만, Ethereum과 동일한 ERC721 표준을 사용하여 호환성 보장

### 기술적 질문

#### Q4: Base Smart Wallet이 무엇인가요?
**답변:**
- Base Smart Wallet은 Account Abstraction (ERC-4337)을 구현한 스마트 계정 지갑입니다
- **전통적 EOA 지갑의 한계 극복:**
  - 브라우저 확장 프로그램(MetaMask 등) 불필요
  - 복잡한 시드구문 관리 불필요
  - 원클릭 지갑 생성 및 트랜잭션
- **우리 프로젝트에서:**
  - `wagmi`의 `baseAccount` 커넥터를 사용하여 통합
  - 사용자가 지갑 확장 프로그램 없이도 바로 NFT 민팅 가능
  - 가스비 최적화로 사용자 경험 향상

#### Q5: Account Abstraction이 무엇인가요?
**답변:**
- Account Abstraction은 스마트 컨트랙트를 지갑처럼 사용할 수 있게 하는 기술입니다
- **EOA (Externally Owned Account) vs Smart Account:**
  - EOA: 개인키로 제어되는 기본 계정 (MetaMask 등)
  - Smart Account: 스마트 컨트랙트로 구현된 계정 (Base Smart Wallet)
- **장점:**
  - 가스비 대납 (Gasless transactions)
  - 멀티시그 (Multi-sig) 지원
  - 복구 메커니즘 (Social recovery)
  - 배치 트랜잭션
- **우리 프로젝트:** Base Smart Wallet을 통해 사용자가 복잡한 지갑 설정 없이 바로 사용 가능

#### Q6: OP Stack이 무엇인가요?
**답변:**
- OP Stack은 Optimism이 개발한 L2 블록체인 개발 프레임워크입니다
- Base는 OP Stack을 포크하여 자체적으로 커스터마이징했습니다
- **주요 구성요소:**
  - Data Availability Layer: 트랜잭션 데이터 저장
  - Execution Layer: 트랜잭션 실행
  - Settlement Layer: Ethereum과의 연결
- **우리 프로젝트:** Base의 OP Stack 기반 아키텍처 덕분에 Ethereum과의 호환성과 낮은 가스비를 동시에 확보

#### Q7: Base의 가스비가 왜 저렴한가요?
**답변:**
- **L2의 배치 처리:**
  - 여러 트랜잭션을 하나의 배치로 묶어서 Ethereum에 제출
  - 가스비를 모든 사용자가 공유하므로 개별 비용이 낮아짐
- **데이터 압축:**
  - 트랜잭션 데이터를 압축하여 저장 공간 절약
  - Ethereum에 저장되는 데이터량 감소로 비용 절감
- **우리 프로젝트:**
  - NFT 민팅 가스비가 $0.001-$2.0 수준으로 매우 저렴
  - 일반 사용자도 부담 없이 여러 번 민팅 가능

#### Q8: Base의 보안성은 어떻게 보장되나요?
**답변:**
- **Ethereum 보안 상속:**
  - Base의 최종 상태는 Ethereum 메인넷에 저장
  - Ethereum의 검증자 네트워크가 보안 보장
- **Fraud Proof 시스템:**
  - 잘못된 트랜잭션에 대해 이의 제기 가능
  - 검증자가 부정행위를 발견하면 롤백
- **Sequencer 분산화 계획:**
  - 현재는 Coinbase가 운영하지만, 점진적 분산화 예정
- **우리 프로젝트:** Base의 보안성을 신뢰하여 소셜 연결을 NFT로 영구 저장

### 구현 관련 질문

#### Q9: wagmi와 viem을 어떻게 사용했나요?
**답변:**
- **wagmi:** React 훅 기반의 Web3 라이브러리
  - `useConnect`, `useWriteContract`, `useWaitForTransactionReceipt` 등 사용
  - Base Smart Wallet 연결 및 트랜잭션 관리
- **viem:** TypeScript 기반의 Ethereum 라이브러리
  - wagmi의 하위 의존성으로 사용
  - 타입 안전한 컨트랙트 상호작용
- **우리 프로젝트:**
  ```typescript
  // wagmi.ts에서 Base 설정
  import { base } from 'wagmi/chains';
  import { baseAccount } from 'wagmi/connectors';
  
  export const config = createConfig({
    chains: [base],
    connectors: [baseAccount({ appName: 'Web3Twin' })],
  });
  ```

#### Q10: ERC721 NFT 컨트랙트를 어떻게 배포했나요?
**답변:**
- **OpenZeppelin 라이브러리 사용:**
  - `ERC721`, `ERC721URIStorage`, `Ownable`, `ReentrancyGuard` 상속
  - 검증된 보안 패턴 활용
- **Hardhat으로 배포:**
  - `hardhat.config.cjs`에서 Base 네트워크 설정 (chainId: 8453)
  - `scripts/deploy-base.cjs`로 Base 메인넷에 배포
  - 배포된 컨트랙트 주소: `0x9896849284779B561fbE4420F56b93a46b2efB39`
- **주요 함수:**
  - `mintTwinNFT`: 트윈 매칭 결과를 NFT로 민팅
  - `getTwinMatch`: NFT의 매칭 정보 조회
  - `getUserTokens`: 사용자의 모든 NFT 조회

#### Q11: Base 네트워크에서 트랜잭션은 어떻게 처리되나요?
**답변:**
- **트랜잭션 플로우:**
  1. 사용자가 Base Smart Wallet로 서명
  2. 트랜잭션이 Base Sequencer로 전송
  3. Base에서 즉시 처리 (빠른 확인)
  4. 배치로 묶여서 Ethereum에 제출 (최종 확정)
- **우리 프로젝트:**
  - `useWriteContract`로 트랜잭션 전송
  - `useWaitForTransactionReceipt`로 확인 대기
  - Base의 빠른 블록 시간으로 즉각적인 피드백 제공

#### Q12: Base의 데이터 가용성(Data Availability)은?
**답변:**
- Base는 현재 Ethereum에 데이터를 저장합니다 (Ethereum DA)
- 향후 EigenDA로 전환 예정 (더 낮은 비용)
- **우리 프로젝트:**
  - NFT 메타데이터는 온체인에 저장
  - 이미지는 API로 동적 생성 (가스비 절감)
  - Base의 데이터 가용성으로 영구 보존 보장

### 생태계 및 미래 질문

#### Q13: Base 생태계의 특징은?
**답변:**
- **Coinbase 통합:**
  - Coinbase Wallet과의 원활한 연동
  - Coinbase 사용자가 쉽게 Base로 진입 가능
- **개발자 친화적:**
  - Ethereum 도구 그대로 사용 가능
  - 풍부한 문서와 튜토리얼
- **활발한 커뮤니티:**
  - Base Korea 커뮤니티 등 글로벌 지원
  - 해커톤과 빌더 프로그램 활발
- **우리 프로젝트:** Base Korea 커뮤니티의 일원으로 참여하며 생태계 성장에 기여

#### Q14: Base의 향후 로드맵은?
**답변:**
- **Sequencer 분산화:** 점진적으로 탈중앙화
- **EigenDA 통합:** 데이터 가용성 비용 절감
- **Superchain 생태계:** OP Stack 기반 여러 체인 간 상호 운용성
- **우리 프로젝트:** Base의 발전에 맞춰 계속 업데이트할 예정

### 발표 시 강조 포인트

1. **Base Smart Wallet의 혁신성:** Web3 진입 장벽을 완전히 제거
2. **가스비 최적화:** 실제 사용 가능한 수준의 저렴한 비용
3. **Ethereum 호환성:** 기존 도구와 표준을 그대로 활용
4. **보안성:** Ethereum의 보안을 상속받는 안전한 L2
5. **실제 구현:** 단순히 사용만 한 것이 아니라, 컨트랙트 배포부터 통합까지 완전 구현

### 예상 질문 대비

**Q: 다른 L2 (Arbitrum, Polygon)와 비교하면?**
- Base는 Coinbase의 지원과 생태계 통합이 강점
- OP Stack 기반으로 Optimism과의 상호 운용성
- Base Smart Wallet의 Account Abstraction이 차별점

**Q: 가스비가 정말 저렴한가요?**
- 실제 NFT 민팅 시 $0.001-$2.0 수준으로 확인됨
- Ethereum 대비 100배 이상 절감
- 일반 사용자도 부담 없이 사용 가능

**Q: Base Smart Wallet의 보안은?**
- 비수탁형(non-custodial) 지갑으로 사용자가 완전한 제어권 보유
- Account Abstraction의 표준(ERC-4337) 기반
- Coinbase의 검증된 인프라 활용

**Q: AI를 사용했나요?**
- 아니요, AI나 머신러닝을 사용하지 않았습니다
- 전통적인 통계 기반 알고리즘을 사용합니다:
  - **Jaccard Similarity**: 두 집합의 교집합/합집합 비율로 텍스트 유사도 측정
  - **Overlap Coefficient**: 두 집합의 교집합/최소 크기 비율로 해시태그/이모지 겹침 측정
  - **가중치 공식**: 60% 텍스트 + 25% 해시태그 + 15% 이모지
- 수학적 집합 연산과 통계 기반 매칭으로 구현했습니다

---

## 📚 기술 용어 쉽게 이해하기 (발표 대비)

### 1. wagmi의 `baseAccount` 커넥터 통합

**쉽게 설명:**
- **wagmi**: React에서 블록체인과 연결하는 도구 (예: 지갑 연결, 트랜잭션 전송)
- **커넥터**: 지갑을 연결하는 방식 (예: MetaMask, Base Smart Wallet)
- **`baseAccount`**: Base Smart Wallet을 연결하는 전용 커넥터

**우리 프로젝트에서:**
```typescript
// src/lib/wagmi.ts
import { baseAccount } from 'wagmi/connectors';

connectors: [
  baseAccount({ appName: 'Web3Twin' }),  // Base Smart Wallet 연결
]
```
- 이 코드로 사용자가 Base Smart Wallet을 쉽게 연결할 수 있게 됩니다
- MetaMask 같은 확장 프로그램 없이도 지갑을 사용할 수 있습니다

**발표 시 설명:**
"wagmi는 React에서 블록체인과 연결하는 도구인데, 여기에 Base Smart Wallet을 연결하는 `baseAccount` 커넥터를 사용했습니다. 이렇게 하면 사용자가 지갑 확장 프로그램 없이도 바로 연결할 수 있습니다."

---

### 2. OP Stack 기반 Optimistic Rollup

**쉽게 설명:**
- **OP Stack**: Optimism이 만든 L2 블록체인 개발 도구 모음
- **Optimistic Rollup**: 트랜잭션을 빠르게 처리하고, 나중에 Ethereum에 저장하는 방식
- **"Optimistic"**: 일단 처리하고, 문제가 있으면 나중에 되돌리는 방식

**작동 원리:**
1. 사용자가 Base에서 트랜잭션 실행 (빠름, 저렴)
2. Base가 여러 트랜잭션을 묶어서 Ethereum에 제출
3. 일정 시간 동안 이의가 없으면 최종 확정
4. 문제가 발견되면 되돌림 (Fraud Proof)

**우리 프로젝트에서:**
- Base는 OP Stack을 사용해서 만들어졌습니다
- 그래서 Ethereum보다 100배 저렴하고 빠릅니다
- 하지만 Ethereum의 보안성은 그대로 유지됩니다

**발표 시 설명:**
"Base는 OP Stack이라는 도구로 만들어졌고, Optimistic Rollup 방식을 사용합니다. 쉽게 말해 트랜잭션을 먼저 빠르게 처리하고, 나중에 Ethereum에 저장하는 방식입니다. 그래서 빠르고 저렴하면서도 안전합니다."

---

### 3. OpenZeppelin 라이브러리 기반

**쉽게 설명:**
- **OpenZeppelin**: 스마트 컨트랙트 보안을 위한 검증된 코드 라이브러리
- **라이브러리**: 자주 쓰는 기능을 미리 만들어둔 코드 모음
- **기반**: 이 라이브러리의 코드를 가져다 쓴다는 뜻

**우리 프로젝트에서:**
```solidity
// contracts/Web3TwinNFT.sol
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Web3TwinNFT is ERC721, Ownable, ReentrancyGuard {
  // ...
}
```
- `ERC721`: NFT 표준 기능 (민팅, 전송 등)
- `Ownable`: 컨트랙트 소유자 관리 (관리자 기능)
- `ReentrancyGuard`: 재진입 공격 방지 (보안)

**왜 중요한가:**
- 직접 만들면 버그나 보안 취약점이 생길 수 있습니다
- OpenZeppelin은 수많은 프로젝트에서 검증된 안전한 코드입니다
- 해킹 사고를 방지하기 위해 사용합니다

**발표 시 설명:**
"스마트 컨트랙트는 한 번 배포하면 수정이 어렵기 때문에 보안이 매우 중요합니다. 그래서 OpenZeppelin이라는 검증된 보안 라이브러리를 사용했습니다. 이렇게 하면 직접 만들 때 생길 수 있는 보안 취약점을 방지할 수 있습니다."

---

### 4. Hardhat으로 Base 메인넷 배포

**쉽게 설명:**
- **Hardhat**: 스마트 컨트랙트 개발 도구 (컴파일, 테스트, 배포)
- **배포**: 작성한 컨트랙트 코드를 블록체인에 올리는 것
- **Base 메인넷**: Base의 실제 운영 네트워크 (테스트넷이 아님)

**우리 프로젝트에서:**
```javascript
// scripts/deploy-base.cjs
const Web3TwinNFT = await ethers.getContractFactory("Web3TwinNFT");
const web3TwinNFT = await Web3TwinNFT.deploy();
await web3TwinNFT.waitForDeployment();
```
- 이 스크립트를 실행하면 컨트랙트가 Base 메인넷에 배포됩니다
- 배포된 주소: `0x9896849284779B561fbE4420F56b93a46b2efB39`
- BaseScan에서 확인 가능: https://basescan.org/address/0x9896849284779B561fbE4420F56b93a46b2efB39

**배포 과정:**
1. Solidity 코드 작성 (`Web3TwinNFT.sol`)
2. Hardhat으로 컴파일 (코드를 기계어로 변환)
3. Base 메인넷에 배포 (실제 블록체인에 올림)
4. 컨트랙트 주소 받음 (이 주소로 접근)

**발표 시 설명:**
"Hardhat은 스마트 컨트랙트를 개발하고 배포하는 도구입니다. 이 도구를 사용해서 우리의 NFT 컨트랙트를 Base 메인넷에 배포했습니다. 배포된 컨트랙트는 BaseScan에서 확인할 수 있습니다."

---

### 5. 온체인 메타데이터 저장

**쉽게 설명:**
- **메타데이터**: NFT의 정보 (이름, 설명, 속성 등)
- **온체인**: 블록체인 위에 저장됨
- **오프체인**: 블록체인 밖에 저장됨 (예: 서버, IPFS)

**우리 프로젝트에서:**
```solidity
// contracts/Web3TwinNFT.sol
struct TwinMatch {
    address user1;
    address user2;
    uint256 similarity;      // 유사도 점수
    uint256 timestamp;       // 민팅 시간
    string sharedHashtags;  // 공유된 해시태그
    string sharedEmojis;    // 공유된 이모지
}

mapping(uint256 => TwinMatch) public twinMatches;  // 블록체인에 저장
```
- 트윈 매칭 정보가 블록체인에 직접 저장됩니다
- `getTwinMatch()` 함수로 언제든 조회 가능합니다
- 서버가 다운되어도 데이터는 영구 보존됩니다

**온체인 vs 오프체인:**
- **온체인 장점**: 영구 보존, 탈중앙화, 서버 불필요
- **온체인 단점**: 가스비가 비쌈 (하지만 Base는 저렴!)
- **오프체인 장점**: 가스비 없음, 큰 데이터 저장 가능
- **오프체인 단점**: 서버 관리 필요, 영구성 보장 어려움

**우리 프로젝트의 하이브리드 방식:**
- 핵심 데이터(매칭 정보)는 온체인에 저장
- 이미지는 API로 동적 생성 (가스비 절감)
- 메타데이터는 API에서 컨트랙트를 읽어서 생성

**발표 시 설명:**
"NFT의 메타데이터, 즉 트윈 매칭 정보를 블록체인에 직접 저장했습니다. 이렇게 하면 서버가 다운되어도 데이터가 영구적으로 보존되고, 누구나 블록체인에서 직접 확인할 수 있습니다. Base의 저렴한 가스비 덕분에 온체인 저장이 가능했습니다."

---

## 🎯 발표 시 요약 (30초 버전)

1. **wagmi의 baseAccount**: Base Smart Wallet을 연결하는 도구
2. **OP Stack**: Base를 만든 기술 프레임워크, 빠르고 저렴하게 만듦
3. **OpenZeppelin**: 검증된 보안 코드 라이브러리, 해킹 방지
4. **Hardhat**: 컨트랙트를 Base 메인넷에 배포하는 도구
5. **온체인 저장**: 데이터를 블록체인에 영구 저장, 서버 없이도 영구 보존

**핵심 메시지:**
"Base의 저렴한 가스비 덕분에 핵심 데이터를 온체인에 저장할 수 있었고, 검증된 보안 라이브러리와 개발 도구를 사용해서 안전하고 효율적으로 구현했습니다."

---

### 6. 매칭 알고리즘 (Jaccard Similarity & Overlap Coefficient)

**쉽게 설명:**
- **AI가 아닙니다**: 머신러닝이나 딥러닝을 사용하지 않습니다
- **통계 기반 알고리즘**: 수학적 집합 연산을 사용합니다
- **Jaccard Similarity**: 두 집합이 얼마나 겹치는지 측정하는 방법
- **Overlap Coefficient**: 두 집합의 공통 부분이 작은 집합의 몇 %인지 측정

**작동 원리:**
1. **텍스트 분석**:
   - 사용자 A의 캐스트에서 단어 추출 → 집합 A
   - 사용자 B의 캐스트에서 단어 추출 → 집합 B
   - Jaccard Similarity = (공통 단어 수) / (전체 고유 단어 수)
   - 예: A={코딩, 블록체인, NFT}, B={코딩, NFT, 음악}
   - 공통: {코딩, NFT} = 2개
   - 전체: {코딩, 블록체인, NFT, 음악} = 4개
   - 유사도 = 2/4 = 0.5 (50%)

2. **해시태그/이모지 분석**:
   - Overlap Coefficient = (공통 항목 수) / (작은 집합의 크기)
   - 예: A의 해시태그 10개, B의 해시태그 5개, 공통 3개
   - 겹침 = 3/5 = 0.6 (60%)

3. **최종 점수**:
   - 60% × 텍스트 유사도 + 25% × 해시태그 겹침 + 15% × 이모지 겹침
   - 예: 0.6 × 0.5 + 0.25 × 0.6 + 0.15 × 0.4 = 0.51 (51%)

**왜 이 방법을 선택했나요:**
- **명확성**: 결과가 어떻게 나왔는지 설명 가능
- **빠름**: AI 모델 학습/추론 없이 즉시 계산
- **가벼움**: 서버 리소스가 거의 필요 없음
- **투명성**: 사용자가 알고리즘을 이해할 수 있음

**발표 시 설명:**
"AI를 사용하지 않고, 전통적인 통계 기반 알고리즘을 사용했습니다. Jaccard Similarity와 Overlap Coefficient라는 수학적 방법으로 텍스트, 해시태그, 이모지의 유사도를 측정하고, 가중치를 적용해서 최종 점수를 계산합니다. 이렇게 하면 결과가 명확하고 설명 가능하며, 빠르게 계산할 수 있습니다."

