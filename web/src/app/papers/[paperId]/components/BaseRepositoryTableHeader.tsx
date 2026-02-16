import { ReactNode } from 'react'

interface BaseRepositoryTableHeaderProps {
  title: string
  description: string
  icon: ReactNode
  length: number
}

export default function BaseRepositoryTableHeader({
  title,
  description,
  icon,
  length,
}: BaseRepositoryTableHeaderProps) {
  return (
    <div className="px-6 py-4 border-b border-foreground/20">
      <div className="flex items-center gap-3">
        {icon}
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <span className="bg-foreground/10 text-foreground text-xs font-medium px-2.5 py-0.5 rounded-full">
          {length}
        </span>
      </div>
      <p className="text-sm text-foreground/60 mt-1">{description}</p>
    </div>
  )
}
