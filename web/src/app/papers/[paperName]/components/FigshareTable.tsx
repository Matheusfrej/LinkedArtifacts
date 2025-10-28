import { useState } from 'react'
import { FigshareArtifact } from '../../../@types/types'
import BaseRepositoryTable from './BaseRepositoryTable'
import { Eye, Download, Database } from 'lucide-react'
import ValidationAction from '../../../../components/ValidationAction'
import { vote } from '../../../../lib/service/artifacts'

interface FigshareTableProps {
  data: FigshareArtifact[]
}

export default function FigshareTable({
  data: initialData,
}: FigshareTableProps) {
  const [data, setData] = useState(initialData)

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
      header: 'Validation',
      align: 'right' as const,
      render: (_value: unknown, item: FigshareArtifact) => (
        <ValidationAction
          artifactId={item.id}
          validation={item.validation}
          onVote={async (type, { increasing }) => {
            const result = await vote({
              artifactId: item.id,
              type,
              increasing,
            })
            // Update the local state with the new validation
            setData(
              data.map((artifact) =>
                artifact.id === item.id
                  ? { ...artifact, validation: result }
                  : artifact,
              ),
            )
          }}
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
