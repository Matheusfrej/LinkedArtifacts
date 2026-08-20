'use client'

import { ArrowUpDown, Check } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import { Button } from '@/components/ui/Button'

export type SortOption =
  | 'default'
  | 'year-desc'
  | 'year-asc'
  | 'title-asc'
  | 'title-desc'
  | 'venue-asc'
  | 'venue-desc'

interface PaperSortProps {
  value: SortOption
  onChange: (value: SortOption) => void
}

const SORT_LABELS: Record<SortOption, { label: string; short: string }> = {
  default: { label: 'Default', short: 'Default' },
  'year-desc': { label: 'Year (Newest first)', short: 'Year ↓' },
  'year-asc': { label: 'Year (Oldest first)', short: 'Year ↑' },
  'title-asc': { label: 'Title (A → Z)', short: 'Title A-Z' },
  'title-desc': { label: 'Title (Z → A)', short: 'Title Z-A' },
  'venue-asc': { label: 'Venue (A → Z)', short: 'Venue A-Z' },
  'venue-desc': { label: 'Venue (Z → A)', short: 'Venue Z-A' },
}

export default function PaperSort({ value, onChange }: PaperSortProps) {
  const current = SORT_LABELS[value] || SORT_LABELS.default
  const isCustomSort = value !== 'default'

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={isCustomSort ? 'secondary' : 'outline'}
            size="sm"
            className="h-8 gap-2 text-xs sm:text-sm font-normal border-border/80 hover:border-border cursor-pointer shadow-none"
            aria-label="Sort papers"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Sort:</span>
            <span className="font-semibold text-foreground">
              {current.label}
            </span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56 p-1.5 shadow-lg">
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => onChange('default')}
              className="flex items-center justify-between cursor-pointer text-xs sm:text-sm"
            >
              <span>Default (Original order)</span>
              {value === 'default' && <Check className="w-4 h-4 text-primary" />}
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-2 py-1">
              Year
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => onChange('year-desc')}
              className="flex items-center justify-between cursor-pointer text-xs sm:text-sm"
            >
              <span>Newest first</span>
              {value === 'year-desc' && (
                <Check className="w-4 h-4 text-primary" />
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onChange('year-asc')}
              className="flex items-center justify-between cursor-pointer text-xs sm:text-sm"
            >
              <span>Oldest first</span>
              {value === 'year-asc' && (
                <Check className="w-4 h-4 text-primary" />
              )}
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-2 py-1">
              Title
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => onChange('title-asc')}
              className="flex items-center justify-between cursor-pointer text-xs sm:text-sm"
            >
              <span>Title (A → Z)</span>
              {value === 'title-asc' && (
                <Check className="w-4 h-4 text-primary" />
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onChange('title-desc')}
              className="flex items-center justify-between cursor-pointer text-xs sm:text-sm"
            >
              <span>Title (Z → A)</span>
              {value === 'title-desc' && (
                <Check className="w-4 h-4 text-primary" />
              )}
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-2 py-1">
              Venue
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => onChange('venue-asc')}
              className="flex items-center justify-between cursor-pointer text-xs sm:text-sm"
            >
              <span>Venue (A → Z)</span>
              {value === 'venue-asc' && (
                <Check className="w-4 h-4 text-primary" />
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onChange('venue-desc')}
              className="flex items-center justify-between cursor-pointer text-xs sm:text-sm"
            >
              <span>Venue (Z → A)</span>
              {value === 'venue-desc' && (
                <Check className="w-4 h-4 text-primary" />
              )}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
