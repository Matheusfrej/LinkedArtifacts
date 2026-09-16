import { Skeleton } from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <div className="py-4 sm:py-8 space-y-5 sm:space-y-6 animate-pulse">
      <Skeleton className="h-4 w-24 sm:w-28" />
      <Skeleton className="h-8 sm:h-10 w-full sm:w-3/4" />
      <Skeleton className="h-4 sm:h-5 w-2/3 sm:w-1/2" />
      <Skeleton className="h-24 sm:h-28 w-full rounded-xl" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <Skeleton className="h-28 sm:h-36 rounded-xl" />
        <Skeleton className="h-28 sm:h-36 rounded-xl" />
        <Skeleton className="h-28 sm:h-36 rounded-xl" />
      </div>
    </div>
  )
}
