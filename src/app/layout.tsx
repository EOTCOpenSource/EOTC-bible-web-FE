import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import Navbar from '@/components/landing/Navbar'
import DownloadApp from '@/components/landing/DownloadApp'
import Footer from '@/components/landing/Footer'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'EOTCBible',
  description: 'Read and study the Ethiopian Holy Bible online',
  icons: {
    icon: [
      { url: '/logo.png', type: 'image/png' },
    ],
    shortcut: ['/logo.png'],
    apple: [{ url: '/logo.png', type: 'image/png' }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <ThemeProvider>
          <Navbar />
          <main className="pt-20">
            {children}
          </main>
          <DownloadApp />
          <Footer/>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
