import './globals.css'
import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import GoogleAnalytics from '../components/GoogleAnalytics'

export const metadata: Metadata = {
  title: { default: '개발자의 기록', template: '%s | 개발자의 기록' },
  description: 'AI와 기술을 활용한 서비스 개발 과정과 경험을 기록하는 블로그',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        url: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        url: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <GoogleAnalytics />
      </head>
      <body className="antialiased min-h-screen bg-white text-slate-900">
        <div className="max-w-[672px] mx-auto py-4 px-6">
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
