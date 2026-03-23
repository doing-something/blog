# Claude Code와 Codex 커스터마이징: 두 도구에서 같은 워크플로우를 일관되게 운영하기

## 배경

이 레포는 Claude Code와 Codex를 주로 사용한다. 같은 OpenSpec 워크플로우를 두 도구에서 실행하기 때문에, 한쪽을 수정하면 다른 쪽도 맞춰야 불일치가 생기지 않는다.

**핵심 구조: 공통 엔진 + 어댑터 계층.** 둘 다 결국 같은 OpenSpec CLI(`openspec status`, `openspec instructions`, `openspec archive` 등)를 호출한다. 차이는 사용자 입력이 그 CLI까지 도달하는 어댑터 계층에 있다. Claude Code에서는 `.claude/commands/opsx/*.md`가, Codex에서는 `AGENTS.md` 매핑 + `.codex/skills/*/SKILL.md`가 그 역할을 한다. 이 문서에서 다루는 command/skill/AGENTS 차이는 "엔진 차이"가 아니라 "어댑터 차이"로 읽으면 된다.

이 문서는 두 도구의 공식 동작 차이를 정리하고, 이 레포가 일관성을 유지하기 위해 어떻게 구성했는지 설명한다.

## 1. 공식 동작

### Claude Code

> 출처: [Memory](https://code.claude.com/docs/en/memory), [Skills](https://code.claude.com/docs/en/skills)

**맥락 전달**

`AGENTS.md`는 자동으로 읽지 않는다. 필요하면 CLAUDE.md에서 명시적으로 읽도록 지시해야 한다.

**확장 방식**

| 경로 | 호출 방식 | 비고 |
|------|-----------|------|
| `.claude/commands/{name}.md` | `/name` 슬래시 커맨드 | 레거시. 여전히 동작하지만 권장하지 않음 |
| `.claude/skills/{name}/SKILL.md` | `/name` 슬래시 커맨드 또는 Claude가 자동 사용 | 권장. 동적 컨텍스트, 서브에이전트 등 추가 기능 제공 |

같은 이름의 command와 skill이 있으면 **skill이 우선**한다.

### Codex

> 출처: [AGENTS.md](https://developers.openai.com/codex/guides/agents-md), [Skills](https://developers.openai.com/codex/skills)

**맥락 전달**

Codex는 `AGENTS.md`를 자동으로 읽는다.

**확장 방식**

| 경로 | 호출 방식 | 비고 |
|------|-----------|------|
| `.agents/skills/{name}/SKILL.md` | 모델이 해석해서 매칭, 또는 `$skill-name`으로 명시 호출 | 공식 스킬 경로 |

### AGENTS.md 접근 방식 비교

| | Claude Code | Codex |
|---|-------------|-------|
| `AGENTS.md` | 자동으로 읽지 않음. CLAUDE.md에서 명시적으로 지시해야 함 | 자동으로 읽음 |

## 2. 이 레포의 커스텀 동작

아래 내용은 Claude Code나 Codex의 공식 기본 사용법이 아니다. OpenSpec이 생성한 기본 구조와 이 프로젝트가 추가한 설정을 구분해서 설명한다.

### OpenSpec 기본 설정 (`openspec init`이 생성)

**opsx:\* 공통 어휘**

OpenSpec은 `opsx:apply`, `opsx:archive`, `opsx:explore`, `opsx:propose` 같은 공통 어휘를 사용한다. 사용자가 어느 도구에서든 같은 이름으로 워크플로우를 실행할 수 있게 하기 위해서다. 호출 문법 차이는 아래 "플랫폼별로 남는 차이" 테이블 참고.

**생성되는 파일 구조**

OpenSpec 초기화 시 Claude Code용 commands + skills, Codex용 skills를 모두 생성한다:

```
.claude/commands/opsx/                 ← Claude Code용 OpenSpec 레거시 진입점
├── apply.md                             공식 확장 모델은 skill 중심 형식
├── archive.md
├── explore.md
└── propose.md

.claude/skills/openspec-*/             ← Claude Code skill 자산
├── openspec-apply-change/SKILL.md     공식 모델 기준으로는 이쪽이 표준 형식
├── openspec-archive-change/SKILL.md    다만 `/opsx:*` 호출의 직접 진입점은 현재 commands
├── openspec-explore/SKILL.md
└── openspec-propose/SKILL.md

.codex/skills/openspec-*/              ← Codex 스킬
├── openspec-apply-change/SKILL.md       ⚠️ 공식 경로는 .agents/skills/
├── openspec-archive-change/SKILL.md     OpenSpec이 .codex/skills/를 사용하지만,
├── openspec-explore/SKILL.md            Codex 공식 경로와 다르다
└── openspec-propose/SKILL.md
```

**정책 배치 기준: 3층 분리**

공통 규칙을 어디에 둘지는 다음 기준으로 나뉜다.

| 정책 층 | 무엇을 두나 | 기준 소스 | 양쪽 도달 방식 |
|---------|------------|----------|--------------|
| 저장소 전역 규칙 | 언어 정책, 코드 품질, 매핑 테이블 등 | `AGENTS.md` | Claude: CLAUDE.md에서 읽도록 지시 / Codex: 자동 로드 |
| OpenSpec schema 규칙 | 기술 스택, artifact 생성 제약, GRAY-AREAS 분류 | `openspec/config.yaml` | `openspec instructions`가 양쪽 모두에 공통 주입 |
| 도구별 워크플로우 지시 | 질문 방식, change 선택 UX, progress 표시 | `.claude/commands/opsx/*.md` / `.codex/skills/*/SKILL.md` | 각 도구가 자기 진입점만 읽음 |

공통 정책은 위 두 층으로 올리고, command/skill에는 도구별 행동 차이만 남기는 것이 유지보수에 유리하다. 다만 Codex skill에 언어 정책 등을 다시 적는 경우가 있는데, 이는 기술적으로 필수가 아니라 워크플로우 실행 시 해당 규칙을 더 강하게 상기시키기 위한 선택적 강화다.

**플랫폼별로 남는 차이**

공통 규칙을 공유해도 해결되지 않는, 플랫폼 실행 표면 차이:

| 차이 | Claude Code | Codex |
|------|-------------|-------|
| 진입점 파일 | `.claude/commands/opsx/*.md` + `.claude/skills/openspec-*/` | `.codex/skills/openspec-*/` (⚠️ 공식은 `.agents/skills/`) |
| 호출 문법 | `/opsx:apply` (슬래시 필수) | `opsx:apply` (슬래시 없이) |
| 사용자 상호작용 | 전용 내장 도구로 질문하고 진행을 추적 | 채팅 메시지로 질문하고 텍스트로 진행 보고 |

### 프로젝트가 추가로 대응한 것

OpenSpec 기본 설정 위에 이 프로젝트가 추가한 대응:

**Codex 호출 매칭 보조**

- Claude Code는 커맨드 이름으로 파일 경로에 결정적 매칭한다
- Codex는 모델 해석으로 스킬을 찾으므로, AGENTS.md에 `opsx:*` → `openspec-*` 매핑 테이블을 추가했다

```markdown
| 명령 | Codex skill |
|------|-------------|
| `opsx:apply` | `openspec-apply-change` |
| `opsx:archive` | `openspec-archive-change` |
```

**커스텀 스킬 추가**

OpenSpec이 기본 제공하지 않는 스킬을 새로 만들 때는 Claude Code와 Codex 양쪽에 파일을 만들어야 한다. 이 프로젝트에서 discuss를 추가한 예:

1. Claude Code: `.claude/commands/opsx/discuss.md` 작성
2. Codex: `.codex/skills/openspec-discuss/SKILL.md` 작성
3. 동작 단계(Steps)는 동일하게 작성
4. 호출 문법만 플랫폼에 맞춤 (`/opsx:discuss` vs `opsx:discuss`)
5. AGENTS.md 매핑 테이블에 `opsx:discuss` → `openspec-discuss` 추가

## 3. 다음 과제: 일관성 유지 vs 도구별 역할 특화

이 문서는 두 도구에서 같은 워크플로우를 일관되게 실행하는 데 초점을 맞췄다. 하지만 실제로 사용하면서 도구마다 잘 맞는 역할이 다르다는 느낌이 있다.

- **Claude Code**: opsx 명령을 통한 대화형 스펙 작성, 탐색, 설계 논의
- **Codex**: 문서 검증, 코드 리뷰 등 — 할 일이 명확하면 깊이 들어가서 전문가처럼 작업하는 경향

확실한 근거를 댈 수는 없지만, 반복 사용하면서 맡기는 역할이 자연스럽게 고정되는 경향이 있었다. 그렇다면 모든 워크플로우를 양쪽에 똑같이 맞추는 대신, 각 도구의 강점에 맞춰 특화하는 편이 낫지 않은가?

다만 그렇게 하려면 "어떤 도구에 어떤 작업을 맡길 때 효과적인가"에 대한 판단 근거가 필요하다. 근거 없이 도구 선택을 강제하면 개인 선호에 불과해진다. Claude Code, Codex, 그 외 모델들에 어떤 역할을 부여해야 효과적인지 — 이것이 이 문서의 다음 숙제다.
