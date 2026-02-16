import { Zap } from 'lucide-react'
import BaseRepositoryTable from './BaseRepositoryTable'
import { ArtifactTableRegistry } from '@/@types'

interface ArtifactTableProps {
  data: ArtifactTableRegistry[]
}

export default function ArtifactTable({ data }: ArtifactTableProps) {
  if (data.length === 0) return null

  const columns = [
    {
      key: 'name' as const,
      header: 'Name',
      render: (value: string) => (
        <span className="font-medium text-foreground">{value}</span>
      ),
    },
  ]

  return (
    <BaseRepositoryTable
      title="Artifacts"
      description="Artifacts from paper"
      icon={<Zap className="w-5 h-5 text-foreground/70" />}
      data={data}
      columns={columns}
    />
  )
}
