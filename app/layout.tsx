import './globals.css'
import type { Metadata } from 'next'
import { ConvexProvider } from '@/components/ConvexProvider'

export const metadata: Metadata = {
  title: 'NeoBank - Modern Banking Simplified',
  description: 'Experience the future of digital banking',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ConvexProvider>{children}</ConvexProvider>
      </body>
    </html>
  )
}
