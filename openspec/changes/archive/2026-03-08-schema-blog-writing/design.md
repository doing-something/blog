## Context

이 블로그 프로젝트는 Next.js 기반이며 `content/posts/` 아래 MDX 파일로 글을 관리한다. 현재 글쓰기 방식은 즉흥적으로 작성한 뒤 AI에게 다듬어달라고 맡기는 식이라 글의 품질이 들쭉날쭉하고 글쓰기 역량 자체가 늘지 않는다. 개발 스펙 명세에 OpenSpec을 적용했을 때 단계별 프로세스만으로 결과물의 일관성이 크게 올라간 경험을 바탕으로, 글쓰기에도 같은 구조화된 접근을 적용한다. 이를 통해 AI가 "다듬기 도구"가 아닌 "각 단계의 코칭 파트너"로 기능하게 한다.

현재 OpenSpec이 설치되어 있고 기본 `spec-driven` 스키마가 있지만, 이는 소프트웨어 개발용(proposal → specs → design → tasks)이라 블로그 글쓰기에는 맞지 않다. OpenSpec은 `openspec schema init`으로 프로젝트-로컬 커스텀 스키마를 지원하며, `openspec/schemas/<name>/` 디렉터리에 `schema.yaml`과 `templates/`를 배치한다.

## Goals / Non-Goals

**Goals:**
- 블로그 글쓰기에 최적화된 3단계 스키마(outline → draft → post)를 만든다
- `/opsx:propose`로 change를 만들면 자연스럽게 글쓰기 워크플로우가 시작되도록 한다
- post artifact가 최종 MDX 파일을 직접 생성하도록 한다

**Non-Goals:**
- 기존 `spec-driven` 스키마 수정 (공존)
- 이미지/미디어 관리 자동화
- 글 발행(deploy) 자동화

## Decisions

### 1. `openspec schema init`으로 스키마 초기화

`schema fork`로 기존 스키마를 복제하는 대신 `schema init`으로 새로 만든다. 블로그 글쓰기와 소프트웨어 개발 워크플로우는 artifact 구성이 완전히 다르므로 fork 후 수정하는 것보다 처음부터 설계하는 것이 깔끔하다.

### 2. 3단계 artifact: outline → draft → post

- **outline**: 주제·핵심 주장·독자·섹션 구조. 글쓰기 전 방향을 잡는 단계.
- **draft**: outline을 바탕으로 전체 본문을 산문으로 작성. 피드백과 수정이 이 단계에서 이뤄진다.
- **post**: draft를 MDX frontmatter + 본문으로 변환. `content/posts/<change-name>.mdx`에 출력.

대안으로 `research` 단계를 추가하는 방안을 고려했으나, 글 주제에 따라 리서치 필요성이 다르고 outline에서 충분히 다룰 수 있어 제외했다.

### 3. 각 artifact의 instructions에 코칭 지시 포함

AI가 단순히 결과물을 생성하는 것이 아니라 각 단계에서 글쓰기 코치로 기능하도록 artifact별 instructions에 코칭 행동을 명시한다. 핵심 원칙은 "먼저 질문, 그 다음 함께 만들기"이며, 피드백은 관점별 체크리스트로 제공한다.

- **outline**: 사용자의 아이디어를 바로 구조화하지 않고, 먼저 의도 탐색 질문(왜 쓰는지, 독자에게 줄 변화, 이 주제를 쓰게 된 계기)을 던진다. 사용자의 답변을 바탕으로 함께 개요를 만든다. Tone 섹션에서는 기존 블로그 톤("경험 공유, 반말 서술체")을 기본값으로 제안하되 글 성격에 따라 조정할 수 있게 한다.
- **draft**: 바로 본문을 써주지 않고, outline의 각 섹션 간 논리 흐름이 자연스러운지, 빠진 논점은 없는지 먼저 점검한다. 사용자가 직접 쓴 초안에 대해 구조·논리·명확성·톤 4가지 관점의 체크리스트로 피드백을 제공한다. 문장 품질 원칙(아래 Decision #4 참조)도 이 단계에서 적용한다.
- **post**: MDX 변환 시 가독성(문단 길이, 소제목 배치, 도입부 흡인력)과 톤 일관성을 점검하고 개선점을 체크리스트로 제안한다. 맞춤법 검사 도구가 사용 가능하면 활용한다. MDX 빌드 검증(`npm run build`)으로 렌더링 오류가 없는지 확인한다.

대안으로 별도의 `coaching-guide.md` 파일을 두는 방안을 고려했으나, OpenSpec artifact의 instructions 필드에 직접 넣는 것이 워크플로우 실행 시 자연스럽게 적용되어 더 효과적이다.

### 4. 문장 품질 원칙을 코칭 instructions에 포함

draft·post 코칭에서 문장 품질을 점검할 때 따를 원칙을 명시한다:

- **쉽고 단순한 문장**: 한 문장에 하나의 생각. 긴 문장은 쪼갠다.
- **명사형 종결 지양**: "~하는 것이다", "~함" 대신 "~한다", "~했다" 등 동사형 종결을 쓴다.
- **중복 표현 제거**: 같은 의미를 다른 말로 반복하지 않는다.
- **불필요한 수식어 제거**: 의미를 더하지 않는 부사·형용사를 뺀다.

이 원칙은 별도 문서가 아닌 draft/post artifact의 instructions에 직접 포함한다. AI가 피드백 체크리스트에서 이 항목들을 점검한다.

### 5. 각 artifact에 완료 조건(completion criteria) 명시

각 단계가 "끝났다"는 판단 기준이 없으면 수정 루프가 무한히 돌 수 있다. artifact별 완료 조건을 명시하여, 조건을 모두 충족하면 다음 단계로 넘어가는 구조로 한다. 이것이 별도의 "반복 수정 루프 명세"나 "품질 판정 기준"을 대체한다.

### 6. change name이 곧 파일명

change name을 영문 kebab-case 슬러그로 제한하고, 이것이 `content/posts/<change-name>.mdx` 파일명이 된다. title(한국어)과 파일명(영문 슬러그)은 분리된다.

### 7. post의 outputPath를 content/posts/에 직접 매핑

apply 시 별도 복사 작업 없이 post artifact가 바로 블로그 콘텐츠 디렉터리에 파일을 생성한다. change name이 곧 파일명이 된다.

### 8. 기본 스키마로 설정

`--default` 플래그를 사용해 `blog-post`를 프로젝트 기본 스키마로 설정한다. 이 프로젝트에서는 소프트웨어 개발 변경보다 블로그 글쓰기가 주된 용도이므로 합리적이다.

## Risks / Trade-offs

- [post artifact가 content/posts/에 직접 쓰기] → change 디렉터리 밖에 파일이 생성되므로, archive 시 해당 파일은 별도 관리 필요. 다만 이것이 최종 산출물이므로 자연스러운 동작이다.
- [outline을 너무 상세하게 작성하면 draft와 중복] → outline 템플릿을 간결하게 유지하여 방향 설정 역할에 집중하도록 한다.
