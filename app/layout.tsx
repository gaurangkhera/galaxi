import React from 'react'
import { Onest } from 'next/font/google'
import './globals.css'
import { ConvexClientProvider } from './ConvexClientProviderWithClerk'
import Navbar from './navbar'
import { ThemeProvider } from '@/components/ThemeProviders'

const font = Onest({
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
          {children}
          </ThemeProvider>
        </body>
        </ConvexClientProvider>
    </html>
  )
}

export default RootLayout