import './globals.css'
import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'

export const metadata: Metadata = {
  title: { default: 'My Blog', template: '%s | My Blog' },
  description: 'Minimal Next.js + MDX Blog',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="antialiased min-h-screen bg-white text-slate-900">
        <div className="max-w-[672px] mx-auto py-4 px-4">
          <header>
            <Navigation />
          </header>
          <main>
            <div className="prose">{children}</div>
          </main>
        </div>
      </body>
    </html>
  )
}
