'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'

export default function Breadcrumb() {
  const pathname = usePathname()

  // Don't show breadcrumb on home page
  if (pathname === '/') {
    return null
  }

  const pathSegments = pathname.split('/').filter(Boolean)

  // Build breadcrumb items
  const breadcrumbItems = []

  // Handle papers routes
  if (pathSegments[0] === 'papers') {
    breadcrumbItems.push({
      label: 'Papers',
      href: '/papers',
      current: pathSegments.length === 1,
    })

    // Handle individual paper page
    if (pathSegments.length === 2) {
      const paperName = decodeURIComponent(pathSegments[1])
      breadcrumbItems.push({
        label: paperName,
        href: `/papers/${pathSegments[1]}`,
        current: true,
      })
    }
  }

  return (
    <nav className="flex items-center py-4 px-6 border-b border-foreground/10 bg-background/50 backdrop-blur-sm">
      <div className="flex items-center space-x-2 text-sm">
        {breadcrumbItems.map((item, index) => (
          <div key={item.href} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 mx-2 text-foreground/40" />
            )}
            {item.current ? (
              <span className="text-foreground font-medium truncate max-w-xs">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-foreground/60 hover:text-foreground transition-colors duration-200"
              >
                {item.label}
              </Link>
            )}
          </div>
        ))}
      </div>
    </nav>
  )
}
