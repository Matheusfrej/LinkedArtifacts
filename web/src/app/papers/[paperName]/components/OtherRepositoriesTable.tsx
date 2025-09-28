import { Zap, ExternalLink } from 'lucide-react'
import BaseRepositoryTableHeader from './BaseRepositoryTableHeader'

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
    <div className="bg-background border border-foreground/20 rounded-lg shadow-sm">
      <BaseRepositoryTableHeader
        title="Other Repositories"
        description="Artifacts from other repositories"
        icon={<Zap className="w-5 h-5 text-foreground/70" />}
        length={data.length}
      />
      <div className="overflow-x-auto">
        <table className="w-full">
          <tbody>
            {data.map((repo) => (
              <tr
                key={repo.id}
                className="border-b border-foreground/5 hover:bg-foreground/5 transition-colors"
              >
                <td className="py-3 px-6">
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    {repo.url}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export type { OtherRepository }
