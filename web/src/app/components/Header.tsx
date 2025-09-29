'use client'
import { ThemeToggle } from 'components/ui/ThemeToggle'

export default function Header() {
  return (
    <header className="w-full border-b border-gray-200 dark:border-gray-700 shadow-sm mb-8">
      <div className="mx-auto px-6 py-4 flex items-center justify-between">
        <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          LinkedArtifacts
        </span>
        <ThemeToggle />
      </div>
    </header>
  )
}
