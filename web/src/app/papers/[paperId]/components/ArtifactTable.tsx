import { Zap } from 'lucide-react'
import BaseRepositoryTable from './BaseRepositoryTable'

interface ArtifactTableProps {
  data: {
    id: number
    name: string | null
    url: string
  }[]
}

export default function ArtifactTable({ data }: ArtifactTableProps) {
  if (data.length === 0) {
    return (
      <div className="bg-card border border-border/60 rounded-xl p-8 text-center text-sm text-muted-foreground">
        No artifacts found for this paper.
      </div>
    )
  }

  const columns = [
    {
      key: 'name' as const,
      header: 'Name',
      render: (value: string) => (
        <span className="font-medium text-foreground">{value || '-'}</span>
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
