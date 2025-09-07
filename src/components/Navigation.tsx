import Link from 'next/link'

export default function Navigation() {
  return (
    <nav className="flex items-center justify-end">
      <div className="flex items-center space-x-6">
        <Link href="/" className="py-6 no-underline text-sm">
          Home
        </Link>
        <Link href="/about" className="py-6 no-underline text-sm">
          About
        </Link>
      </div>
    </nav>
  )
}
