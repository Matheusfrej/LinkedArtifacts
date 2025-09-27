import type { ReactNode } from "react"

interface Column<T> {
  key: keyof T
  header: string
  align?: "left" | "center" | "right"
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (value: any, item: T) => ReactNode
}

interface BaseRepositoryTableProps<T> {
  title: string
  description: string
  icon: ReactNode
  data: T[]
  columns: Column<T>[]
}

export default function BaseRepositoryTable<T extends { id: string; url: string }>({
  title,
  description,
  icon,
  data,
  columns,
}: BaseRepositoryTableProps<T>) {
  if (data.length === 0) return null

  return (
    <div className="bg-background border border-foreground/20 rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-foreground/20">
        <div className="flex items-center gap-3">
          {icon}
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <span className="bg-foreground/10 text-foreground text-xs font-medium px-2.5 py-0.5 rounded-full">
            {data.length}
          </span>
        </div>
        <p className="text-sm text-foreground/60 mt-1">{description}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-foreground/5">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`px-6 py-3 text-xs font-medium text-foreground/60 uppercase tracking-wider ${
                    column.align === "center" ? "text-center" : column.align === "right" ? "text-right" : "text-left"
                  }`}
                >
                  {column.header}
                </th>
              ))}
              <th className="px-6 py-3 text-center text-xs font-medium text-foreground/60 uppercase tracking-wider">
                Link
              </th>
            </tr>
          </thead>
          <tbody className="bg-background divide-y divide-foreground/10">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-foreground/5">
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className={`px-6 py-4 text-sm ${
                      column.align === "center" ? "text-center" : column.align === "right" ? "text-right" : "text-left"
                    }`}
                  >
                    {column.render ? column.render(item[column.key], item) : String(item[column.key])}
                  </td>
                ))}
                <td className="px-6 py-4 text-center">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-foreground/10 transition-colors text-foreground/60 hover:text-foreground"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
