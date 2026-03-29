# AGENTS.md

1. 저장소별 작업 규칙을 고정
예: OpenSpec 워크플로우 해석 방식, 테스트 작성 절차, React 구현 원칙, 커밋 메시지 규칙
2. 에이전트 간 행동을 일관되게 만든다.
예: Codex, Claude Code 같은 서로 다른 에이전트가 들어와도 같은 방식으로 변경하고, 같은 품질 기준을 따르게 합니다.
3. 프로젝트 맥락을 코드 밖에서 제공한다.
예: “opsx:*는 쉘 명령이 아니라 워크플로우 요청으로 취급”, “테스트 작성 전 Given-When-Then 확인 필수”, “리뷰/커밋 설명은 한국어” 같은 팀 규칙을 알려준다.

AGENTS.md의 핵심 역할은 Claude, Codex, Cursor처럼 도구가 달라도 공통으로 적용할 저장소 규칙을 한 곳에 둔다. 

---

# AGENTS.md를 활용한 맞춤 지침

[https://developers.openai.com/codex/guides/agents-md](https://developers.openai.com/codex/guides/agents-md)

Codex 프로젝트에 추가적인 지침과 컨텍스트를 제공한다.

Codex는 작업을 시작하기 전 항상 [AGENTS.md](http://AGENTS.md) 파일을 읽는다. 전역 지침(Global Guidance) 위에 프로젝트별 설정을 계층적으로 쌓음으로써, 어떤 저장소를 열더라도 매번 동일한 기대치와 기준을 가지고 작업을 시작할 수 있다.

## Codex의 지침 발견 방식

Codex는 시작할 때(실행당 1회, TUI의 경우 대개 세션이 시작될 때 1회) instruction 체인을 생성한다. 

지침을 찾는 우선순위는 다음과 같다.

- 전역 스코프: Codex 홈 디렉터리(기본값 `~/.codex`, `CODEX_HOME` 설정 시 해당 경로)에서 `AGENTS.override.md`가 있으면 이를 읽고, 없으면 `AGENTS.md`를 읽는다. Codex는 이 단계에서 비어 있지 않은 첫 번째 파일만 사용한다.
- 프로젝트 스코프: 프로젝트 루트(일반적으로 Git 루트)에서 시작하여 현재 작업 디렉터리까지 내려가며 탐색한다. 프로젝트 루트를 찾을 수 없는 경우 현재 디렉터리만 확인한다. 경로상의 각 디렉터리에서 `AGENTS.override.md`, `AGENTS.md`, 그리고 `project_doc_fallback_filenames`에 정의된 대체 이름 순으로 확인한다. Codex는 디렉터리당 최대 하나의 파일만 포함한다.
- 병합 순서: Codex는 루트부터 아래로 파일들을 빈 줄로 구분하여 연결한다. 현재 디렉터리에 더 가까운 파일일수록 결합된 프롬프트의 뒷부분에 나타나므로 이전 지침을 덮어쓰게 된다.

Codex는 빈 파일은 건너뛰며, 결합된 크기가 `project_doc_max_bytes`(기본값 32KiB)로 정의된 제한에 도달하면 파일 추가를 중단한다. 

## 전역 지침 생성

모든 저장소가 귀하의 작업 협약을 상속받을 수 있도록 Codex 홈 디렉터리에 영구적인 기본 설정을 생성하세요.

```jsx
mkdir -p ~/.codex
```

---

# 보장하진 않는다.

### 1. LLM의 본질: 확률적 추론

확률기반 텍스트 생성기

규칙을 강제하지 못한다. 그럴듯하게 무시할 수 있다.

### 2. 컨텍스트 한계

지시가 많아지면 일부 드롭됨. 

### 3. 장기 작업에서 fidelity 감소

처음엔 잘 따르다가 시간이 갈수록 점점 어긋남

### 4. [AGENTS.md](http://AGENTS.md) 자체 품질 문제

모호한 지시는 거의 무시된다.

실행 가능한 규칙이 아니면 존재해도 효과 없다.

### 실제로는

best effort 힌트 수준.

강제력 없고, 쉽게 깨짐.

### 원인

**작업 중 목표 압축(goal compression) 발생**

긴 작업을 수행하면 모델은 점점 목표를 단순화한다. 

초기

```jsx
- given-when-then 유지
- task마다 commit
- conventional commit
- 테스트 통과
```

중간 이후

```jsx
- 기능 동작하게 만들기
```

이걸 instruction drift라고 한다. → 규칙이 “중요도 낮은 것”으로 밀려남

**멀티스텝 실행에서 상태가 끊긴다**

특히 이런 상황에서 잘 깨진다.

- 여러 파일 수정
- 리팩토링
- 디버깅 반복

각 단계마다 모델은 사실상 새로 추론한다.

```jsx
step 1: 규칙 잘 지킴
step 5: 일부 잊음
step 10: 거의 안 지킴
```

### 실무적으로 어떻게 써야 하나?

- 구체적인 명령형 규칙
예: npm test 실패 시 commit 금지
- 자동 검증 (CI, lint, test)
- 리뷰 단계 분리 (agent → review)

## 해결하려면 접근을 바꿔야 한다.

사전 강제 → 실패한다.

### 사후 검증으로 바꿔야 한다.

예:

- 테스트 형식 검사
- commit 메시지 검사
- CI에서 reject

### reviewer agent 분리

```jsx
Agent A (구현)
↓
Agent B (검증)
```

Agent B 역할

- given-when-then 검사
- commit 규칙 검사
- 누락 시 reject

### 규칙을 행동 트리거로 바꿔라

❌

```jsx
항상 conventional commit 사용
```

✅

```jsx
각 task 완료 시 반드시:
1. 테스트 작성 (given-when-then)
2. 테스트 실행
3. conventional commit 생성
4. commit 없으면 작업 완료로 간주하지 않음
```

→ “조건 → 행동” 구조가 훨씬 잘 먹힌다

### **중간 체크포인트 강제**

예:

- “각 task 끝날 때 commit 로그 출력”
- “다음 단계 전에 test 결과 출력”

→ drift를 줄이는 방법

---

## 해결 전략

**“지키지 않으면 실패하는 구조”로 바꿔야 한다**

### 테스트 포맷을 “부분적으로라도” 강제

예: given-when-then을 완전 이해 못해도 형식만이라도 체크

**예시 (간단한 패턴 검사)**

```jsx
expect(testName).toMatch(/given .* when .* then .*/i)
```

또는 test description lint rule

### 테스트 템플릿 강제 (가장 효과적)

AGENTS.md가 아니라 코드 구조로 강제

```jsx
describe("feature", () => {
  describe("given ...", () => {
    describe("when ...", () => {
      it("then ...", () => {
        // test
      });
    });
  });
});
```

 이렇게 하면:

- 모델이 “형식”을 따라가기 쉬움
- 자유도를 줄여서 안정성 상승

### [AGENTS.md](http://AGENTS.md) 지시

```jsx
## Test rules

For every new test:
1. Use nested `describe` blocks in `given -> when -> then` form.
2. Use `// arrange`, `// act`, `// assert` comments inside each test.
3. Do not use vague names like `should work`, `should return correctly`.
4. `pnpm check:test-template` must pass before task completion.
```

### snippet / generator로 시작점을 강제한다

- 방법 A: IDE snippet
예를 들어, VS Code snippet
- 방법 B: 코드 생성 스크립트
pnpm gen:test login로 파일을 생성하게 한다.

```jsx
describe("login", () => {
  describe("given ...", () => {
    describe("when ...", () => {
      it("then ...", async () => {
        // arrange
        // act
        // assert
      });
    });
  });
});
```

### 형식 검사 스크립트를 pre-commit / CI에 붙인다

## 테스트가 실제로 결함을 잡는 데 도움이 되느냐

### 테스트를 “검증”이 아니라 “산출물”로 취급한다

- 너무 당연한 happy path만 반복
- 구현을 그대로 따라가는 assertion
- 바뀌어도 아무 문제 없는 사소한 값 비교
- 실제 장애 가능성과 무관한 케이스 추가

### “쉽게 쓸 수 있는 테스트” 쪽으로 기운다

AI는 어려운 테스트보다 쉬운 테스트를 선호한다.

예를 들면 원래 중요한 건:

- 경계값
- 상태 전이
- 예외 복구
- 외부 시스템 실패
- race condition
- 권한 누락
- idempotency

그런데 AI는 대신 이런 걸 쓴다:

- 입력하면 출력됨
- 함수 호출하면 배열 반환
- mock 한 번 호출됐음
- truthy / defined 검사

쓰기가 쉽고, 실패할 가능성이 낮고, 겉보기엔 완성돼 보이기 때문이다.

### 구현 종속 테스트를 만들기 쉽다

좋은 테스트는 보통 행동 계약(contract)을 검증해야 한다.

그런데 AI는 자주 **현재 구현 디테일**을 검증한다.

```jsx
expect(repository.save).toHaveBeenCalledTimes(1)
```

이 assertion은 때로 필요하지만, 이것만 있으면 대개 가치가 낮다.

왜냐하면 이 테스트는:

- 사용자 관점 결과를 검증하지 않고
- 내부 호출 순서나 현재 구조에 묶이며
- 리팩토링에 취약하다

## 실무적으로 더 좋은 테스트 규칙

### 1) “행동 규칙” 단위로 테스트하게 한다

테스트 1개는 하나의 행동 규칙만 검증해야 한다.

예:

- 유효한 비밀번호면 로그인 성공
- 잘못된 비밀번호면 인증 실패
- 삭제된 계정이면 로그인 거부
- 만료된 토큰이면 재사용 거부

반대로 나쁜 테스트는:

- 여러 규칙을 한꺼번에 검증
- assertion 여러 개로 뒤섞임
- 실패 원인 불명확

### 2) “버그를 막는 테스트만 허용”하는 기준을 둔다

각 테스트에 대해 리뷰 질문을 하나 둔다:

**이 테스트가 실패하면 실제로 어떤 결함을 조기에 발견하는가?**

답이 불분명하면 가치가 낮다.

- returns defined → 어떤 결함을 막는지 불명확
- rejects invalid password → 인증 우회 버그 방지
- does not create duplicate order on retry → 중복 결제/주문 방지

### 3) 우선순위를 “위험도” 기준으로 강제한다

AI에게 테스트를 쓰게 할 때도 우선순위를 정해줘야 한다.

예를 들면 테스트 작성 순서를 이렇게 고정한다:

1. 실패/예외 케이스
2. 경계값
3. 상태 전이
4. 권한/보안
5. 외부 의존성 오류
6. 정상 흐름

### 4) 금지 패턴을 명시한다

AI는 “해야 할 것”보다 “하지 말 것”을 명시하면 더 안정적일 때가 많다.

```jsx
Do not write tests that:
- only check `toBeDefined`, `toBeTruthy`, or non-null without validating business meaning
- only verify mock call counts unless that interaction is the business requirement
- duplicate the implementation logic in the assertion
- cover trivial getters/setters unless they contain business logic
- test framework behavior or library internals
```

## 더 현실적인 방법: 테스트 리뷰어를 따로 둔다

이 문제는 구현 에이전트에게 맡기면 잘 안 풀린다.

**작성과 평가를 분리**해야 한다.

- 1단계: 구현 AI
    - 코드 작성
    - 기본 테스트 작성
- 2단계: 리뷰 AI 또는 리뷰 스크립트
    - 이 테스트가 어떤 규칙을 검증하는가
    - 어떤 실제 결함을 막는가
    - assertion이 결과 중심인가
    - 구현 세부사항에 과도하게 묶였는가
    - 더 중요한 리스크를 놓쳤는가

이렇게 분리해야 품질이 올라간다.

## 팀 규칙을 이렇게 바꾸는 게 낫다

형식 규칙 + 품질 규칙을 함께 둬야 한다.

- 형식 규칙
    - given / when / then 구조 사용
    - arrange / act / assert 구분
    - 테스트 이름은 하나의 행동 규칙만 설명
- 품질 규칙
    - 각 테스트는 하나의 비즈니스 규칙 또는 실패 조건을 검증해야 한다
    - 약한 assertion만 사용한 테스트 금지
    - mock interaction-only 테스트 금지
    - 현재 구현 세부사항이 아니라 관찰 가능한 결과를 우선 검증
    - happy path보다 실패/경계/보안/상태 전이 테스트를 우선 작성

### 좋은 테스트 규칙 문구 예시

```jsx
A valid test must satisfy all of the following:

1. It verifies one business rule, failure mode, or state transition.
2. It would fail if a meaningful defect were introduced.
3. Its primary assertion checks an externally observable outcome.
4. It does not rely only on weak assertions such as `toBeDefined`, `toBeTruthy`, or mock call counts.
5. It is more valuable than a trivial happy-path duplication of the implementation.
```