import { FigshareArtifact } from '../../../../@types'
import BaseRepositoryTable from './BaseRepositoryTable'
import { Eye, Download, Database } from 'lucide-react'
import ValidationAction from '@/components/ValidationAction'
import { ValidationField } from './ValidationField'

interface FigshareTableProps {
  paperName: string
  data: FigshareArtifact[]
}

export default function FigshareTable({ paperName, data }: FigshareTableProps) {
  const columns = [
    {
      key: 'title' as const,
      header: 'Title',
      render: (value: string) => (
        <span className="font-medium text-foreground">{value}</span>
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
    {
      key: 'validation' as const,
      header: <ValidationField />,
      align: 'right' as const,
      render: (_value: unknown, item: FigshareArtifact) => (
        <ValidationAction
          paperName={paperName}
          initialValidation={item.validation}
        />
      ),
    },
  ]

  return (
    <BaseRepositoryTable
      title="Figshare"
      description="Table with Figshare artifacts from paper with associated metadata"
      icon={<Database className="h-5 w-5 text-foreground/70" />}
      data={data}
      columns={columns}
    />
  )
}
