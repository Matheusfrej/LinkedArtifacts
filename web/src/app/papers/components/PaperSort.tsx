'use client'

import { ArrowUpDown, Check, Loader2 } from 'lucide-react'
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
  isLoading?: boolean
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

export default function PaperSort({
  value,
  onChange,
  isLoading = false,
}: PaperSortProps) {
  const current = SORT_LABELS[value] || SORT_LABELS.default
  const isCustomSort = value !== 'default'

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={isCustomSort ? 'secondary' : 'outline'}
            size="sm"
            disabled={isLoading}
            className="h-8.5 sm:h-8 gap-1.5 sm:gap-2 text-xs sm:text-sm font-normal border-border/80 hover:border-border cursor-pointer shadow-none px-2.5 sm:px-3 transition-all"
            aria-label="Sort papers"
          >
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-primary shrink-0" />
            ) : (
              <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            )}
            <span className="hidden xs:inline">Sort:</span>
            <span className="font-semibold text-foreground truncate max-w-[130px] sm:max-w-none">
              {current.label}
            </span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-56 max-w-[calc(100vw-2rem)] p-1.5 shadow-lg"
        >
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => onChange('default')}
              disabled={isLoading}
              className="flex items-center justify-between cursor-pointer text-xs sm:text-sm"
            >
              <span>Default (Original order)</span>
              {value === 'default' && (
                <Check className="w-4 h-4 text-primary" />
              )}
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-2 py-1">
              Year
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => onChange('year-desc')}
              disabled={isLoading}
              className="flex items-center justify-between cursor-pointer text-xs sm:text-sm"
            >
              <span>Newest first</span>
              {value === 'year-desc' && (
                <Check className="w-4 h-4 text-primary" />
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onChange('year-asc')}
              disabled={isLoading}
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
              disabled={isLoading}
              className="flex items-center justify-between cursor-pointer text-xs sm:text-sm"
            >
              <span>Title (A → Z)</span>
              {value === 'title-asc' && (
                <Check className="w-4 h-4 text-primary" />
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onChange('title-desc')}
              disabled={isLoading}
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
              disabled={isLoading}
              className="flex items-center justify-between cursor-pointer text-xs sm:text-sm"
            >
              <span>Venue (A → Z)</span>
              {value === 'venue-asc' && (
                <Check className="w-4 h-4 text-primary" />
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onChange('venue-desc')}
              disabled={isLoading}
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
