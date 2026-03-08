## Why

글쓰기 습관이 잡히지 않아 블로그 글 작성이 꾸준히 이루어지지 않고 있다. 현재 방식은 즉흥적으로 글을 쓴 뒤 AI에게 "다듬어줘"라고 던지는 식인데, 이렇게 하면 글의 구조나 품질이 들쭉날쭉하고 글쓰기 자체의 역량도 늘지 않는다.

개발 스펙 명세 작성에 OpenSpec을 적용했을 때 단계별 프로세스를 따르는 것만으로도 결과물의 일관성과 완성도가 크게 올라갔다. 글쓰기에도 같은 접근을 적용하면 — 개요 → 초안 → 최종본이라는 모범사례 프로세스를 구조화하여 — "일단 쓰고 AI에게 맡기기" 대신 각 단계를 의식적으로 밟는 습관을 만들 수 있다.

이를 통해 AI는 "다듬기 도구"가 아니라 "각 단계의 코칭 파트너"로 역할이 바뀌고, 글쓰기 프로세스 자체가 반복 가능한 워크플로우로 자리잡게 된다.

## What Changes

- 블로그 글쓰기 전용 OpenSpec 스키마(`blog-post`)를 새로 생성한다.
- 스키마 워크플로우: `outline`(개요·주제 정의) → `draft`(초안 작성) → `post`(최종 MDX 파일 생성)
- 각 artifact에 블로그 포맷에 맞는 템플릿과 instruction을 정의한다.
- 프로젝트 기본 스키마를 `blog-post`로 설정하여 `openspec new change`시 자동 적용되도록 한다.

## Capabilities

### New Capabilities
- `blog-post-schema`: 블로그 글쓰기에 특화된 OpenSpec 커스텀 스키마 정의. outline → draft → post 3단계 워크플로우, 각 단계별 템플릿·규칙·의존성 설정을 포함한다.

### Modified Capabilities
_(없음 — 기존 spec 없음)_

## Impact

- `openspec/schemas/blog-post/` 디렉터리에 schema.yaml과 templates 추가
- 프로젝트 `.openspec.yaml` 또는 openspec config에 기본 스키마 설정 변경
- 기존 `spec-driven` 스키마에는 영향 없음 (별도 스키마로 공존)
