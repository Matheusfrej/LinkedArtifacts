import { Skeleton } from '@/components/ui/Skeleton'

export function PaperItemSkeleton() {
  return (
    <li className="text-left pb-4 border-b border-border/40 last:border-b-0">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
        <div className="flex-1 min-w-0 space-y-2">
          {/* Title and badges skeleton */}
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-6 w-3/4 max-w-lg" />
            <div className="flex items-center gap-1.5">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </div>
          </div>
          {/* Metadata line (authors, venue, year) */}
          <Skeleton className="h-4 w-1/2 max-w-sm" />
        </div>
        {/* DOI link skeleton */}
        <div className="shrink-0 self-start sm:self-auto pt-0.5">
          <Skeleton className="h-6 w-18 rounded" />
        </div>
      </div>
    </li>
  )
}

export function PaperListItemsSkeleton({ count = 5 }: { count?: number }) {
  return (
    <ul className="space-y-5 sm:space-y-6" aria-label="Loading papers list">
      {Array.from({ length: count }).map((_, index) => (
        <PaperItemSkeleton key={index} />
      ))}
    </ul>
  )
}

export default function PapersPageSkeleton() {
  return (
    <div className="py-4 sm:py-8" aria-label="Loading papers page">
      {/* Search Bar Skeleton */}
      <div className="flex flex-row items-center w-full max-w-xl mx-auto mb-6 sm:mb-8 gap-2">
        <Skeleton className="h-10 flex-1 rounded-lg" />
        <Skeleton className="h-10 w-20 rounded-lg shrink-0" />
      </div>

      {/* Control Bar: Counter, Filters & Sorting */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex flex-row items-center justify-between gap-3 border-b border-border/40 pb-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8.5 w-28 rounded-md" />
        </div>

        {/* Filter pills skeleton */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 w-full">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton
              key={i}
              className={`h-7 sm:h-8 rounded-full ${
                i % 2 === 0 ? 'w-24 sm:w-28' : 'w-32 sm:w-40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Paper items */}
      <PaperListItemsSkeleton count={6} />
    </div>
  )
}
