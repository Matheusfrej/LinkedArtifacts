'use client'

import React from 'react'
import Image from 'next/image'
import { CircleHelp } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog'

interface IconGuideItem {
  id: string
  name: string
  tag: string
  icon: string
  description: string
  theme: {
    border: string
    pill: string
  }
}

const ICON_GUIDE_ITEMS: IconGuideItem[] = [
  {
    id: 'artifact',
    name: 'With artifact',
    tag: 'Artifact',
    icon: '/icons/artifact/icon.svg',
    description:
      'Indicates that the paper has associated artifacts (such as source code, datasets, replication packages, scripts, supplementary tools) linked to the publication.',
    theme: {
      border: 'border-blue-500/20 dark:border-blue-500/30',
      pill: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20',
    },
  },
  {
    id: 'available',
    name: 'Artifacts Available',
    tag: 'Available',
    icon: '/icons/artifact/available.svg',
    description:
      'Author-created artifacts are placed on a publicly accessible archival repository with a long-term retention policy (e.g. Zenodo, Figshare) and a DOI (Digital Object Identifier).',
    theme: {
      border: 'border-emerald-500/20 dark:border-emerald-500/30',
      pill: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
    },
  },
  {
    id: 'functional',
    name: 'Evaluated & Functional',
    tag: 'Functional',
    icon: '/icons/artifact/functional.svg',
    description:
      'The artifacts associated with the research are found to be documented, consistent, complete, exercisable and include appropriate evidence of verification and validation.',
    theme: {
      border: 'border-rose-500/20 dark:border-rose-500/30',
      pill: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20',
    },
  },
  {
    id: 'reusable',
    name: 'Evaluated & Reusable',
    tag: 'Reusable',
    icon: '/icons/artifact/reusable.svg',
    description:
      'The artifacts associated with the paper are of a quality that significantly exceeds minimal functionality. That is, they have all the qualities of the Functional level, but, in addition, they are very carefully documented and well-structured to the extent that reuse and repurposing are facilitated.',
    theme: {
      border: 'border-red-500/20 dark:border-red-500/30',
      pill: 'bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/20',
    },
  },
  {
    id: 'reproduced',
    name: 'Results Reproduced',
    tag: 'Reproduced',
    icon: '/icons/artifact/reproduced.svg',
    description:
      'The main experimental results and findings of the paper have been independently reproduced by a different team using the author-provided artifact.',
    theme: {
      border: 'border-amber-500/20 dark:border-amber-500/30',
      pill: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20',
    },
  },
  {
    id: 'replicated',
    name: 'Results Replicated',
    tag: 'Replicated',
    icon: '/icons/artifact/replicated.svg',
    description:
      'The main findings and claims of the paper have been independently replicated by a different team without using the author-supplied artifact (e.g. independently implemented from scratch).',
    theme: {
      border: 'border-indigo-500/20 dark:border-indigo-500/30',
      pill: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20',
    },
  },
]

interface ArtifactIconsGuideModalProps {
  trigger?: React.ReactNode
}

export default function ArtifactIconsGuideModal({
  trigger,
}: ArtifactIconsGuideModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 text-xs sm:text-sm font-medium border-border/80 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-all"
            title="Artifact Icons Guide"
          >
            <CircleHelp className="w-4 h-4 text-primary shrink-0" />
            <span className="hidden sm:inline">Icons Guide</span>
            <span className="sm:hidden">Guide</span>
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
        {/* Modal Header */}
        <DialogHeader className="p-5 sm:p-6 pb-3 border-b border-border/40">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <CircleHelp className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-base sm:text-lg">
                Artifact Icons Guide
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm mt-0.5">
                Understand the meaning of each icon in the page.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto px-5 sm:px-6 py-4 space-y-3 max-h-[calc(90vh-140px)]">
          {ICON_GUIDE_ITEMS.map((item) => (
            <div
              key={item.id}
              className={`flex items-start gap-3.5 p-3 sm:p-3.5 rounded-xl border ${item.theme.border} bg-muted/20 hover:bg-muted/40 transition-colors`}
            >
              {/* Icon */}
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 shrink-0 flex items-center justify-center rounded-xl bg-background border border-border/50 shadow-xs mt-0.5">
                <Image
                  src={item.icon}
                  alt={item.name}
                  width={28}
                  height={28}
                  className="object-contain w-6 h-6 sm:w-7 sm:h-7"
                />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                  <h4 className="font-semibold text-xs sm:text-sm text-foreground">
                    {item.name}
                  </h4>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${item.theme.pill}`}
                  >
                    {item.tag}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <DialogFooter className="p-4 sm:px-6 border-t border-border/40 bg-muted/10 flex flex-row items-center justify-between gap-2">
          <p className="text-[11px] text-muted-foreground">
            Based on the ACM Artifact Review &amp; Badging guidelines.
          </p>
          <DialogClose asChild>
            <Button
              variant="secondary"
              size="sm"
              className="text-xs cursor-pointer"
            >
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
