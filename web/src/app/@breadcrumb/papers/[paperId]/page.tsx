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
      <BreadcrumbItem className="min-w-0">
        <BreadcrumbPage
          className="capitalize truncate max-w-[160px] xs:max-w-[240px] sm:max-w-md md:max-w-xl inline-block"
          title={idOrTitle}
        >
          {idOrTitle}
        </BreadcrumbPage>
      </BreadcrumbItem>
    </>
  )
}
