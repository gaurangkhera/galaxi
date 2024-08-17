import React from 'react'
import { Onest } from 'next/font/google'
import './globals.css'
import { ConvexClientProvider } from './ConvexClientProviderWithClerk'

const font = Onest({
  subsets: ['latin'],
})

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html>
        <ConvexClientProvider>
        <body className={font.className}>
            {children}
        </body>
        </ConvexClientProvider>
    </html>
  )
}

export default RootLayout