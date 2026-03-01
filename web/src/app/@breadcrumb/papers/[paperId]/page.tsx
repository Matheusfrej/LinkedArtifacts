import {
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/Breadcrumb'
import { findPaperById } from '@/lib/service/papers'

export default async function Page({
  params,
}: {
  params: Promise<{ paperId: string }>
}) {
  const { paperId } = await params

  let idOrTitle = paperId

  try {
    const id = Number(paperId)
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
