import { BreadcrumbItem, BreadcrumbSeparator } from '@/components/ui/Breadcrumb'
import { Skeleton } from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem className="min-w-0 flex items-center">
        <Skeleton className="h-4 w-28 sm:w-44 rounded" />
      </BreadcrumbItem>
    </>
  )
}
