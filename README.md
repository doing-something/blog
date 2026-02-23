# Blog

Next.js(App Router) + Contentlayer 기반 블로그입니다.  
이 프로젝트는 별도 서버 없이 정적 사이트로 빌드되어 GitHub Pages로 배포됩니다.

## Local Development

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
```

정상 빌드 시 정적 결과물은 `out/` 디렉터리에 생성됩니다.

## Deploy to GitHub Pages

1. GitHub 저장소에서 `Settings > Pages`로 이동
2. `Build and deployment`의 `Source`를 `GitHub Actions`로 선택
3. `main` 브랜치에 푸시

`.github/workflows/deploy-pages.yml` 워크플로가 실행되어 `out/`를 자동 배포합니다.

## Notes

- 프로젝트 저장소명이 `username.github.io`가 아니면, 배포 시 자동으로 `basePath`가 적용됩니다.
- 정적 호스팅 특성상 서버 런타임 기능(SSR/ISR/API Routes)은 사용할 수 없습니다.

## Tech Stack

- Next.js 15
- React 19
- Contentlayer + MDX
- Tailwind CSS

## Reference

- Next.js Static Exports: https://nextjs.org/docs/app/building-your-application/deploying/static-exports
- GitHub Pages with Actions: https://docs.github.com/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
