import './globals.css'
import { ReactNode } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SplashScreen from '@/components/SplashScreen'
import GlowBackground from '@/components/GlowBackground'
import AppBackground from '@/components/AppBackground'
import PageTransition from '@/components/PageTransition'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })

export const metadata = {
  title: 'ScaleHub',
  description: 'Book local service providers — request bookings with name & phone.'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-scalebg text-white antialiased font-sans">
  <SplashScreen />
  <AppBackground />
  <GlowBackground />
        <div className="min-h-screen flex flex-col container max-w-6xl px-4 sm:px-6 lg:px-8">
          <Header />
          <PageTransition>
            <main className="flex-1 w-full">{children}</main>
          </PageTransition>
          <Footer />
        </div>
      </body>
    </html>
  )
}
