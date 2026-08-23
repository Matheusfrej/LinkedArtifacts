'use client'

import type React from 'react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function SearchBar({
  value,
  onChange,
  placeholder,
}: SearchBarProps) {
  const [input, setInput] = useState(value)

  useEffect(() => {
    setInput(value)
  }, [value])

  const handleSearch = () => {
    onChange(input)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="flex flex-row items-center w-full max-w-xl mx-auto mb-6 sm:mb-8 gap-2">
      <div className="relative flex-1 min-w-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || 'Search by title, author, venue, year...'}
          className="w-full pl-9 pr-3 h-10 text-sm sm:text-base rounded-lg"
          aria-label="Search papers"
        />
      </div>
      <Button
        onClick={handleSearch}
        aria-label="Search papers"
        className="h-10 px-4 sm:px-5 font-medium shrink-0 rounded-lg cursor-pointer"
      >
        Search
      </Button>
    </div>
  )
}
