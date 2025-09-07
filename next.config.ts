import withMDX from '@next/mdx'
import { withContentlayer } from 'next-contentlayer'

const nextConfig = {
  experimental: { mdxRs: true },
}

export default withContentlayer(withMDX()(nextConfig))
