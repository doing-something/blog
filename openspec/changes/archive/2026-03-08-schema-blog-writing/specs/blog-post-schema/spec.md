## ADDED Requirements

### Requirement: Schema defines three-phase blog writing workflow
스키마는 `outline` → `draft` → `post` 3단계 artifact 파이프라인을 정의해야 한다(SHALL). 각 artifact는 이전 단계에 의존하며, `post`가 완료되어야 apply 가능 상태가 된다.

#### Scenario: New change uses blog-post schema
- **WHEN** `openspec new change "my-post" --schema blog-post` 실행
- **THEN** change 디렉터리에 `.openspec.yaml`이 생성되고 schema가 `blog-post`로 설정된다

#### Scenario: Artifact dependency chain
- **WHEN** outline이 완료되지 않은 상태에서 draft의 status를 확인
- **THEN** draft는 `blocked` 상태이고 missingDeps에 `outline`이 포함된다

### Requirement: Outline artifact captures topic and structure in fixed format
outline artifact는 아래 고정 섹션을 포함해야 한다(SHALL). 각 섹션의 형식이 명확히 정의되어 있어야 한다.

- **Topic**: 글 주제를 1문장으로 기술
- **Thesis**: 핵심 주장을 1-2문장으로 명시
- **Audience**: 대상 독자와 그 독자의 현재 상태(무엇을 모르거나 겪고 있는지)를 기술
- **Tone**: 글의 톤을 선택하고 근거를 기술 (예: "경험 공유, 반말 서술체 — 개인 블로그이므로")
- **Sections**: 섹션 목록. 각 섹션은 제목 + 한줄 요약으로 구성

#### Scenario: Outline template provides all required sections
- **WHEN** outline artifact의 template을 확인
- **THEN** Topic, Thesis, Audience, Tone, Sections 섹션이 존재하고, 각 섹션에 형식 안내가 포함된다

#### Scenario: Outline captures key message
- **WHEN** 사용자가 outline을 작성
- **THEN** Thesis가 1-2문장으로 명시되고, Sections의 각 항목이 제목 + 한줄 요약 형태이다

#### Scenario: Outline completion criteria
- **WHEN** outline의 완료 여부를 판단
- **THEN** 다음을 모두 충족해야 한다: (1) Topic이 1문장으로 존재 (2) Thesis가 1-2문장으로 존재 (3) Audience가 독자와 현재 상태를 포함 (4) Tone이 선택·근거와 함께 존재 (5) Sections가 2개 이상이고 각각 제목+요약을 포함

### Requirement: Draft artifact produces full prose with clear input/output
draft artifact는 outline을 입력으로 받아 마크다운 산문을 출력해야 한다(SHALL). draft는 outline에 의존한다.

- **입력**: 완료된 outline (Topic, Thesis, Audience, Tone, Sections)
- **출력**: outline의 Sections 구조를 유지한 마크다운 본문. `##` 소제목으로 섹션을 구분하고, 각 섹션은 2-5개 문단의 산문으로 구성한다. outline에서 정의한 Tone을 따른다.

#### Scenario: Draft depends on outline
- **WHEN** draft의 instructions를 조회
- **THEN** dependencies에 outline이 포함되어 있다

#### Scenario: Draft contains full content matching outline sections
- **WHEN** draft 작성이 완료
- **THEN** outline의 Sections에 정의된 모든 섹션에 대응하는 `##` 소제목과 본문이 존재한다

#### Scenario: Draft completion criteria
- **WHEN** draft의 완료 여부를 판단
- **THEN** 다음을 모두 충족해야 한다: (1) outline의 모든 섹션에 대한 본문이 존재 (2) 각 섹션이 2개 이상 문단으로 구성 (3) outline의 Thesis가 글 전체에서 일관되게 유지 (4) outline의 Tone과 본문 톤이 일치 (5) 문장 품질 원칙 준수 (명사형 종결 없음, 중복 표현 없음, 불필요한 수식어 없음)

### Requirement: Post artifact generates final MDX file with project conventions
post artifact는 draft를 이 프로젝트의 MDX 포맷으로 변환하여 `content/posts/` 경로에 생성해야 한다(SHALL). post는 draft에 의존한다.

**MDX 포맷 규칙:**
- YAML frontmatter 필수 필드: `title` (한국어), `date` (YYYY-MM-DD), `description` (1문장 요약), `draft` (boolean)
- 본문 첫 줄은 `---` 구분선으로 시작
- 소제목은 `##` 사용
- 파일명은 영문 kebab-case 슬러그: `content/posts/<change-name>.mdx`

#### Scenario: Post produces valid MDX with frontmatter
- **WHEN** post 작성이 완료
- **THEN** 출력 파일에 `title`, `date`, `description`, `draft` 필드가 포함된 YAML frontmatter가 존재한다

#### Scenario: Post file naming follows convention
- **WHEN** change name이 "my-first-post"
- **THEN** 출력 파일 경로가 `content/posts/my-first-post.mdx`이다

#### Scenario: Post body follows project MDX structure
- **WHEN** post 본문을 확인
- **THEN** frontmatter 직후 `---` 구분선이 있고, 소제목은 `##`을 사용한다

#### Scenario: Post completion criteria
- **WHEN** post의 완료 여부를 판단
- **THEN** 다음을 모두 충족해야 한다: (1) frontmatter 4개 필드가 모두 존재 (2) 본문 구조가 프로젝트 MDX 규칙을 따름 (3) draft의 모든 내용이 누락 없이 포함 (4) 맞춤법 검사 통과 (도구 가용 시) (5) MDX 빌드 검증 통과 (`npm run build` 오류 없음)

### Requirement: Each artifact instructions define AI coaching behavior
각 artifact의 instructions는 AI가 글쓰기 코치로서 수행할 행동을 명시해야 한다(SHALL). AI는 결과물을 바로 생성하지 않고, 사용자의 사고를 이끌어내는 질문과 피드백을 먼저 제공한다.

**코칭 행동 원칙:**
- AI는 먼저 질문하고, 사용자 응답을 받은 후에 결과물을 함께 만든다
- 피드백은 체크리스트 형태로 관점별(구조, 논리, 명확성, 톤)로 제공한다
- 사용자가 직접 쓴 내용을 우선하고, AI는 개선 제안만 한다

**문장 품질 원칙 (draft·post 코칭에서 적용):**
- 쉽고 단순한 문장: 한 문장에 하나의 생각
- 명사형 종결 지양: "~하는 것이다" 대신 "~한다"
- 중복 표현 제거
- 불필요한 수식어 제거

**단계별 코칭 행동:**

- **outline 코칭**: 의도 탐색 질문(왜 쓰는지, 독자에게 줄 변화, 이 주제를 쓰게 된 계기) → 답변 기반으로 함께 개요 구성
- **draft 코칭**: outline 기반 논리 흐름 점검(섹션 순서, 빠진 논점, 중복) → 사용자 초안에 대해 구조·논리·명확성·톤·문장품질 관점별 체크리스트 피드백
- **post 코칭**: MDX 변환 시 가독성 점검(문단 길이, 소제목 배치, 도입부 흡인력) → 톤 일관성 확인 → 문장 품질 원칙 최종 점검 → 개선점 제안

#### Scenario: Outline coaching asks intent questions before structuring
- **WHEN** outline 단계에서 AI가 작동
- **THEN** 사용자에게 글의 핵심 의도를 묻는 질문(왜 쓰는지, 독자에게 줄 변화)을 먼저 제시하고, 답변 후에 개요를 함께 구성한다

#### Scenario: Draft coaching provides structured feedback
- **WHEN** 사용자가 draft 초안을 제출
- **THEN** AI는 구조·논리·명확성·톤·문장품질 5가지 관점의 체크리스트 형태로 피드백을 제공한다

#### Scenario: Draft coaching checks sentence quality
- **WHEN** AI가 draft 문장을 점검
- **THEN** 명사형 종결, 중복 표현, 불필요한 수식어가 있으면 구체적 위치와 개선안을 제시한다

#### Scenario: Post coaching checks readability and tone
- **WHEN** post 단계에서 AI가 작동
- **THEN** 문단 길이, 소제목 배치, 톤 일관성을 점검하고 개선점을 체크리스트로 제안한다

### Requirement: Schema is set as project default
`blog-post` 스키마가 프로젝트 기본 스키마로 설정되어야 한다(SHALL). 이후 `openspec new change`시 별도 `--schema` 플래그 없이 자동 적용된다.

#### Scenario: Default schema applied automatically
- **WHEN** `openspec new change "any-post"` 실행 (--schema 플래그 없이)
- **THEN** 생성된 change의 schema가 `blog-post`이다

### Requirement: Change name follows slug convention
change name은 영문 kebab-case 슬러그여야 한다(SHALL). 이 이름이 곧 MDX 파일명이 된다.

#### Scenario: Change name becomes filename
- **WHEN** `openspec new change "my-first-post"` 실행
- **THEN** 최종 출력 파일은 `content/posts/my-first-post.mdx`이다
