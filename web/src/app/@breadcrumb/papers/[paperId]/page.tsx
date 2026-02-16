import {
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/Breadcrumb'
import { findPaperById } from '@/lib/service/papers'

export default async function Page({
  params,
}: {
  params: { paperId: string }
}) {
  let idOrTitle = params.paperId

  try {
    const id = Number(params.paperId)
    if (!Number.isNaN(id)) {
      const paper = await findPaperById({ id })
      if (paper?.title) idOrTitle = paper.title
    }
  } catch (err) {
    console.error('Failed to load paper for breadcrumb', err)
  }

  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage className="capitalize">{idOrTitle}</BreadcrumbPage>
      </BreadcrumbItem>
    </>
  )
}
