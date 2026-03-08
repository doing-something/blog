# Project Rules

## OpenSpec

- 블로그 글 작성 change: `--schema blog-post`를 사용한다. (예: `openspec new change "my-post" --schema blog-post`)
- 설정 관련 change: `schema-*` 접두사 + 기본 `spec-driven` 스키마를 사용한다. (예: `openspec new change "schema-add-review-step"`)
- 설정 관련 change만 git에 추적된다. 블로그 글 작성 과정은 gitignore된다.
