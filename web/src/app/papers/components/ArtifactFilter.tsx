'use client'

import { Loader2 } from 'lucide-react'

export const artifactFilterOptions = [
  { value: 'artifact', label: 'With artifact' },
  { value: 'Available', label: 'Available' },
  { value: 'Evaluated & Functional', label: 'Evaluated & Functional' },
  { value: 'Evaluated & Reusable', label: 'Evaluated & Reusable' },
  { value: 'Results Reproduced', label: 'Results Reproduced' },
  { value: 'Results Replicated', label: 'Results Replicated' },
] as const

export type ArtifactFilterValue =
  (typeof artifactFilterOptions)[number]['value']

interface ArtifactFilterProps {
  selected: ArtifactFilterValue[]
  onChange: (
    value: ArtifactFilterValue[],
    changedFilter?: ArtifactFilterValue,
  ) => void
  isLoading?: boolean
  pendingFilter?: ArtifactFilterValue | null
}

export default function ArtifactFilter({
  selected,
  onChange,
  isLoading = false,
  pendingFilter = null,
}: ArtifactFilterProps) {
  return (
    <fieldset className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 w-full">
      <legend className="sr-only">
        Filter papers by artifact and evaluation status
      </legend>
      {artifactFilterOptions.map((option) => {
        const isSelected = selected.includes(option.value)
        const isPending = isLoading && pendingFilter === option.value

        return (
          <label
            key={option.value}
            className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium border transition-all select-none whitespace-nowrap ${
              isLoading ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'
            } ${
              isSelected
                ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                : 'bg-muted/40 hover:bg-muted text-foreground/80 border-border/70 hover:border-border'
            }`}
          >
            <input
              type="checkbox"
              checked={isSelected}
              disabled={isLoading}
              onChange={(event) => {
                if (isLoading) return
                if (event.target.checked) {
                  onChange([...selected, option.value], option.value)
                } else {
                  onChange(
                    selected.filter((value) => value !== option.value),
                    option.value,
                  )
                }
              }}
              className="sr-only"
            />
            {isPending && (
              <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
            )}
            <span>{option.label}</span>
          </label>
        )
      })}
    </fieldset>
  )
}
