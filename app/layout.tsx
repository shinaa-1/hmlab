import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const metadata: Metadata = {
  title: 'H+M Lab - Human Voice, Machine Precision',
  description: 'AI voice generation and cloning platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}