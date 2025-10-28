import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from '@/components/ui/Breadcrumb'
import React from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink href="/papers">Papers</BreadcrumbLink>
      </BreadcrumbItem>
      {children}
    </BreadcrumbList>
  )
}
