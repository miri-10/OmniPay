// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ClientProviders from '@/components/ClientProviders'
import BackgroundWrapper from '@/components/BackgroundWrapper'
import TopBanner from '@/components/TopBanner'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'OmniPay',
  description: 'AI-Powered Payroll on Solana',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <ClientProviders>
          <BackgroundWrapper />
          <TopBanner />
          <div className="page-background">
            {children}
          </div>
        </ClientProviders>
      </body>
    </html>
  )
}
