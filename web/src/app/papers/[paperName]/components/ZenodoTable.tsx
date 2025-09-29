import BaseRepositoryTable from './BaseRepositoryTable'
import { Eye, Download, FileText } from 'lucide-react'

export interface ZenodoArtifact {
  id: string
  title: string
  version: string
  license: string
  views: number
  downloads: number
  citations: number
  url: string
}

interface ZenodoTableProps {
  data: ZenodoArtifact[]
}

export default function ZenodoTable({ data }: ZenodoTableProps) {
  const columns = [
    {
      key: 'title' as const,
      header: 'Title',
      render: (value: string) => (
        <span className="font-medium text-foreground">{value}</span>
      ),
    },
    {
      key: 'version' as const,
      header: 'Version',
      render: (value: string) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20">
          {value}
        </span>
      ),
    },
    {
      key: 'license' as const,
      header: 'License',
      render: (value: string) => (
        <span className="text-foreground">{value}</span>
      ),
    },
    {
      key: 'views' as const,
      header: 'Views',
      align: 'right' as const,
      render: (value: number) => (
        <div className="flex items-center justify-end gap-1">
          <Eye className="h-3 w-3" />
          {value.toLocaleString()}
        </div>
      ),
    },
    {
      key: 'downloads' as const,
      header: 'Downloads',
      align: 'right' as const,
      render: (value: number) => (
        <div className="flex items-center justify-end gap-1">
          <Download className="h-3 w-3" />
          {value.toLocaleString()}
        </div>
      ),
    },
    {
      key: 'citations' as const,
      header: 'Citations',
      align: 'right' as const,
      render: (value: number) => (
        <span className="text-foreground">{value}</span>
      ),
    },
  ]

  return (
    <BaseRepositoryTable
      title="Zenodo"
      description="Table with Zenodo artifacts from paper with associated metadata"
      icon={<FileText className="h-5 w-5 text-foreground/70" />}
      data={data}
      columns={columns}
    />
  )
}
