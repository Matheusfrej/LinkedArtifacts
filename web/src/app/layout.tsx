import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Header from './components/Header'
import React from 'react'
import { ThemeProvider } from 'components/ThemeProvider'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'LinkedArtifacts',
  description: 'Link papers with its artifacts',
}

export default function RootLayout({
  breadcrumb,
  children,
}: Readonly<{
  breadcrumb: React.ReactNode
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          {breadcrumb}
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
