'use client'

import type React from 'react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

import { useState } from 'react'
import { Button } from 'components/ui/Button'
import { Input } from 'components/ui/Input'

export default function SearchBar({
  value,
  onChange,
  placeholder,
}: SearchBarProps) {
  const [input, setInput] = useState(value)

  // Keep local input in sync if parent resets value
  // (optional, can be omitted if not needed)
  // useEffect(() => { setInput(value); }, [value])

  const handleSearch = () => {
    onChange(input)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="flex justify-center mb-8 gap-2">
      <Input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || 'Search...'}
        className="w-full max-w-xl"
      />
      <Button onClick={handleSearch} aria-label="Search papers">
        Search
      </Button>
    </div>
  )
}
