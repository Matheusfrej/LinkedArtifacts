'use client'

import Image from 'next/image'
import { Award, CheckCircle2 } from 'lucide-react'
import type { Badge } from '@/lib/service/papers'

interface PaperBadgesProps {
  badges?: Badge[]
  hasArtifact?: boolean
}

const BADGE_CONFIG = {
  Available: {
    fileName: 'available',
    label: 'Artifacts Available',
    shortTag: 'Available',
    description:
      'In a public repository with a long-term retention policy. A DOI needs to be provided.',
    theme: {
      border: 'border-emerald-500/30 hover:border-emerald-500/60',
      bg: 'bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-800 dark:text-emerald-300',
      pill: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
      tooltipBorder: 'border-emerald-500/30',
    },
  },
  'Evaluated & Functional': {
    fileName: 'functional',
    label: 'Evaluated & Functional',
    shortTag: 'Functional',
    description:
      'Artifacts are documented, consistent, complete, exercisable, and include evidence of verification and validation.',
    theme: {
      border: 'border-rose-500/30 hover:border-rose-500/60',
      bg: 'bg-rose-500/5 hover:bg-rose-500/10 text-rose-800 dark:text-rose-300',
      pill: 'bg-rose-500/15 text-rose-700 dark:text-rose-300',
      tooltipBorder: 'border-rose-500/30',
    },
  },
  'Evaluated & Reusable': {
    fileName: 'reusable',
    label: 'Evaluated & Reusable',
    shortTag: 'Reusable',
    description: 'Functional, significantly exceed minimal functionality.',
    theme: {
      border: 'border-red-500/30 hover:border-red-500/60',
      bg: 'bg-red-500/5 hover:bg-red-500/10 text-red-800 dark:text-red-300',
      pill: 'bg-red-500/15 text-red-700 dark:text-red-300',
      tooltipBorder: 'border-red-500/30',
    },
  },
  'Results Reproduced': {
    fileName: 'reproduced',
    label: 'Results Reproduced',
    shortTag: 'Reproduced',
    description:
      'Results of this paper have been reproduced by a different team using the original artifact.',
    theme: {
      border: 'border-amber-500/30 hover:border-amber-500/60',
      bg: 'bg-amber-500/5 hover:bg-amber-500/10 text-amber-800 dark:text-amber-300',
      pill: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
      tooltipBorder: 'border-amber-500/30',
    },
  },
  'Results Replicated': {
    fileName: 'replicated',
    label: 'Results Replicated',
    shortTag: 'Replicated',
    description:
      'Results of this paper have been replicated by a different team without the original artifact.',
    theme: {
      border: 'border-indigo-500/30 hover:border-indigo-500/60',
      bg: 'bg-indigo-500/5 hover:bg-indigo-500/10 text-indigo-800 dark:text-indigo-300',
      pill: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300',
      tooltipBorder: 'border-indigo-500/30',
    },
  },
} as const

export default function PaperBadges({ badges = [] }: PaperBadgesProps) {
  if (badges.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mr-1">
        <Award className="w-4 h-4 text-foreground/70 shrink-0" />
        <span>Badges:</span>
      </div>

      {badges.map((badge) => {
        const config = BADGE_CONFIG[badge.name as keyof typeof BADGE_CONFIG]
        const fileName = config?.fileName || 'icon'
        const label = config?.label || badge.name
        const shortTag = config?.shortTag || 'Certified'
        const description =
          config?.description ||
          'Artifact evaluated and certified for this paper.'
        const theme = config?.theme || {
          border: 'border-border/60 hover:border-foreground/40',
          bg: 'bg-muted/50 text-foreground',
          pill: 'bg-foreground/10 text-foreground',
          tooltipBorder: 'border-border',
        }

        return (
          <div
            key={badge.id}
            className="group relative inline-flex items-center"
            tabIndex={0}
          >
            {/* Compact Badge Chip */}
            <div
              className={`inline-flex items-center gap-1.5 sm:gap-2 pl-1.5 pr-2.5 py-1 rounded-full border ${theme.border} ${theme.bg} transition-all duration-200 cursor-help select-none`}
            >
              <div className="relative w-4.5 h-4.5 sm:w-5 sm:h-5 shrink-0 flex items-center justify-center">
                <Image
                  src={`/icons/artifact/${fileName}.svg`}
                  alt={label}
                  width={20}
                  height={20}
                  className="object-contain drop-shadow-xs"
                />
              </div>

              <span className="text-xs font-medium">{label}</span>

              <span
                className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-full ${theme.pill}`}
              >
                {shortTag}
              </span>
            </div>

            {/* Hover Tooltip Popup */}
            <div
              role="tooltip"
              className={`absolute bottom-full left-0 sm:left-1/2 sm:-translate-x-1/2 mb-2 w-64 sm:w-72 max-w-[calc(100vw-2.5rem)] p-3 rounded-xl bg-popover text-popover-foreground border ${theme.tooltipBorder} shadow-xl text-xs opacity-0 pointer-events-none group-hover:opacity-100 group-focus:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-50`}
            >
              <div className="flex items-center gap-2 mb-1.5 pb-1.5 border-b border-border/40">
                <Image
                  src={`/icons/artifact/${fileName}.svg`}
                  alt={label}
                  width={20}
                  height={20}
                  className="object-contain shrink-0"
                />
                <span className="font-semibold text-foreground">{label}</span>
              </div>
              <p className="text-muted-foreground leading-relaxed text-[11px] sm:text-xs">
                {description}
              </p>
              <div className="mt-2 pt-1.5 border-t border-border/40 flex items-center justify-between text-[10px] text-muted-foreground">
                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3 h-3 shrink-0" />
                  Verified Evaluation
                </span>
              </div>

              {/* Triangle Arrow */}
              <div className="hidden sm:block absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-popover" />
            </div>
          </div>
        )
      })}
    </div>
  )
}
