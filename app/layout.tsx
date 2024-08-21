import React from 'react'
import { Inter, Onest } from 'next/font/google'
import './globals.css'
import { ConvexClientProvider } from './ConvexClientProviderWithClerk'
import Navbar from './navbar'
import { ThemeProvider } from '@/components/ThemeProviders'
import { Toaster } from 'sonner'

const font = Inter({
  subsets: ['latin'],
})

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html>
        <ConvexClientProvider>
        <body className={font.className}>
          <ThemeProvider attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange>
          <Navbar />
          <Toaster position='top-center' />
          {children}
          </ThemeProvider>
        </body>
        </ConvexClientProvider>
    </html>
  )
}

export default RootLayout