import { allPosts } from 'contentlayer/generated'
import Link from 'next/link'

export default function BlogIndex() {
  const posts = allPosts
    .filter((p) => !p.draft)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))

  return (
    <>
      {posts.map((post) => (
        <article key={post.slug}>
          <Link href={post.url}>
            <h2 className="text-lg">{post.title}</h2>
          </Link>
          <p>{post.description}</p>
        </article>
      ))}
    </>
  )
}
