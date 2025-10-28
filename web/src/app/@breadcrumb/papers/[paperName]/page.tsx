import {
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/Breadcrumb'

export default async function Page({
  params,
}: {
  params: { paperName: string }
}) {
  const param = await params
  const paperName = decodeURIComponent(param.paperName)

  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage className="capitalize">{paperName}</BreadcrumbPage>
      </BreadcrumbItem>
    </>
  )
}
