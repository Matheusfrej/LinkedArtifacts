'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { Moon, Sun, Loader2 } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isChanging, setIsChanging] = useState(false)
  const [pendingTheme, setPendingTheme] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSelectTheme = (newTheme: 'light' | 'dark' | 'system') => {
    if (isChanging || newTheme === theme) return
    setIsChanging(true)
    setPendingTheme(newTheme)
    setTheme(newTheme)

    // Give visual feedback that the theme is applying
    setTimeout(() => {
      setIsChanging(false)
      setPendingTheme(null)
    }, 450)
  }

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        disabled
        className="opacity-50 cursor-not-allowed"
        aria-label="Loading theme toggle"
      >
        <span className="h-[1.2rem] w-[1.2rem] block" />
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          disabled={isChanging}
          className="cursor-pointer relative transition-all"
          aria-label={isChanging ? 'Applying theme...' : 'Toggle theme'}
        >
          {isChanging ? (
            <Loader2 className="h-[1.2rem] w-[1.2rem] animate-spin text-primary" />
          ) : (
            <>
              <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            </>
          )}
          <span className="sr-only">
            {isChanging ? 'Changing theme...' : 'Toggle theme'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="cursor-pointer flex items-center justify-between"
          disabled={isChanging}
          onClick={() => handleSelectTheme('light')}
        >
          <span>Light</span>
          {isChanging && pendingTheme === 'light' && (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-primary ml-2" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer flex items-center justify-between"
          disabled={isChanging}
          onClick={() => handleSelectTheme('dark')}
        >
          <span>Dark</span>
          {isChanging && pendingTheme === 'dark' && (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-primary ml-2" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer flex items-center justify-between"
          disabled={isChanging}
          onClick={() => handleSelectTheme('system')}
        >
          <span>System</span>
          {isChanging && pendingTheme === 'system' && (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-primary ml-2" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
