import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { allPosts } from 'contentlayer/generated'
import { marked } from 'marked'

export const revalidate = 3600

export async function generateStaticParams() {
  return allPosts.filter((p) => !p.draft).map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = allPosts.find((p) => p.slug === slug)
  if (!post) return {}
  return { title: post.title, description: post.description }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = allPosts.find((p) => p.slug === slug)
  if (!post) return notFound()

  const htmlContent = marked(post.body.raw)

  return (
    <article className="pt-10">
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </article>
  )
}
