import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from 'components/ui/Breadcrumb'

export default async function BreadcrumbSlot({
  params,
}: {
  params: { paperName: string }
}) {
  const param = await params
  const paperName = decodeURIComponent(param.paperName)

  return (
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink href="/papers">Papers</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage className="capitalize">{paperName}</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  )
}
