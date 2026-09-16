'use client'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ThemeToggle'

export default function Header() {
  return (
    <header className="w-full border-b border-border/80 bg-background/95 backdrop-blur-xs sticky top-0 z-40 shadow-xs mb-4 sm:mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 flex items-center justify-between">
        <Link
          href="/papers"
          className="text-xl sm:text-2xl font-bold tracking-tight text-foreground hover:opacity-90 transition-opacity"
        >
          LinkedArtifacts
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
