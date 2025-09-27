interface OtherRepository {
  id: string
  url: string
}

interface OtherRepositoriesTableProps {
  data: OtherRepository[]
}

export default function OtherRepositoriesTable({ data }: OtherRepositoriesTableProps) {
  if (data.length === 0) return null

  return (
    <div className="bg-background border border-foreground/20 rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-foreground/20">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-5 h-5 text-foreground/70"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Other Repositories</h3>
            <p className="text-sm text-foreground/60">Artifacts from other repositories</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-foreground/10">
              <th className="text-left py-3 px-6 text-sm font-medium text-foreground/70">Link</th>
            </tr>
          </thead>
          <tbody>
            {data.map((repo) => (
              <tr key={repo.id} className="border-b border-foreground/5 hover:bg-foreground/5 transition-colors">
                <td className="py-3 px-6">
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    {repo.url}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
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
