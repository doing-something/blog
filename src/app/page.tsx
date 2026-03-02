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
            <h2 className="text-lg mb-0.5">{post.title}</h2>
          </Link>
          <time dateTime={post.date} className="text-sm text-gray-500 dark:text-gray-400 block">
            {new Date(post.date).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              timeZone: 'UTC',
            })}
          </time>
          <p className="mt-1">{post.description}</p>
        </article>
      ))}
    </>
  )
}
