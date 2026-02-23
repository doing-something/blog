import withMDX from '@next/mdx'
import { withContentlayer } from 'next-contentlayer'
import type { NextConfig } from 'next'

const isGithubActions = process.env.GITHUB_ACTIONS === 'true'
const repository = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? ''
const isUserOrOrgSite = repository.endsWith('.github.io')
const basePath =
  isGithubActions && repository && !isUserOrOrgSite ? `/${repository}` : ''

const nextConfig: NextConfig = {
  experimental: { mdxRs: true },
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath,
  assetPrefix: basePath || undefined,
}

export default withContentlayer(withMDX()(nextConfig))
