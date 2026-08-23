import { Breadcrumb } from '@/components/ui/Breadcrumb'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-2 sm:mb-4">
      <Breadcrumb>{children}</Breadcrumb>
    </div>
  )
}
