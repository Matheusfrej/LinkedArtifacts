'use client'

import Image from 'next/image'
import { Loader2 } from 'lucide-react'

export const artifactFilterOptions = [
  {
    value: 'artifact',
    label: 'With artifact',
    fullLabel: 'With artifact',
    icon: '/icons/artifact/icon.svg',
  },
  {
    value: 'Available',
    label: 'Available',
    fullLabel: 'Artifacts Available',
    icon: '/icons/artifact/available.svg',
  },
  {
    value: 'Evaluated & Functional',
    label: 'Functional',
    fullLabel: 'Evaluated & Functional',
    icon: '/icons/artifact/functional.svg',
  },
  {
    value: 'Evaluated & Reusable',
    label: 'Reusable',
    fullLabel: 'Evaluated & Reusable',
    icon: '/icons/artifact/reusable.svg',
  },
  {
    value: 'Results Reproduced',
    label: 'Reproduced',
    fullLabel: 'Results Reproduced',
    icon: '/icons/artifact/reproduced.svg',
  },
  {
    value: 'Results Replicated',
    label: 'Replicated',
    fullLabel: 'Results Replicated',
    icon: '/icons/artifact/replicated.svg',
  },
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
            title={option.fullLabel}
            className={`inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium border transition-all select-none whitespace-nowrap ${
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
            {isPending ? (
              <Loader2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 animate-spin shrink-0" />
            ) : (
              <Image
                src={option.icon}
                alt=""
                width={18}
                height={18}
                className="w-4 h-4 sm:w-4.5 sm:h-4.5 object-contain shrink-0"
                aria-hidden="true"
              />
            )}
            <span>{option.label}</span>
          </label>
        )
      })}
    </fieldset>
  )
}
