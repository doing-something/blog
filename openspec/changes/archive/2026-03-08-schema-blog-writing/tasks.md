## 1. 스키마 초기화

- [x] 1.1 `openspec schema init blog-post --default`로 스키마 디렉터리 생성
- [x] 1.2 생성된 `openspec/schemas/blog-post/schema.yaml`에 3단계 artifact 정의 작성 (outline → draft → post, 의존성 체인, apply.requires: [post])

## 2. 템플릿 작성

- [x] 2.1 `openspec/schemas/blog-post/templates/outline.md` 템플릿 작성 (Topic, Thesis, Audience, Tone, Sections)
- [x] 2.2 `openspec/schemas/blog-post/templates/draft.md` 템플릿 작성 (본문 산문 구조)
- [x] 2.3 `openspec/schemas/blog-post/templates/post.md` 템플릿 작성 (MDX frontmatter + 본문)

## 3. 검증

- [x] 3.1 `openspec schema validate blog-post`로 스키마 유효성 확인
- [x] 3.2 테스트 change 생성(`openspec new change "test-post" --schema blog-post`)하여 artifact 상태 및 dependency 체인 확인
- [x] 3.3 테스트 change 정리 (삭제)
