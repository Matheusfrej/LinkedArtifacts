import { Zap } from 'lucide-react'
import BaseRepositoryTable from './BaseRepositoryTable'

interface OtherRepository {
  id: string
  url: string
}

interface OtherRepositoriesTableProps {
  data: OtherRepository[]
}

export default function OtherRepositoriesTable({
  data,
}: OtherRepositoriesTableProps) {
  if (data.length === 0) return null

  return (
    <BaseRepositoryTable
      title="Other Repositories"
      description="Artifacts from other repositories"
      icon={<Zap className="w-5 h-5 text-foreground/70" />}
      data={data}
      columns={[]}
    />
  )
}

export type { OtherRepository }
