import { ExternalLink } from 'lucide-react'
import type { ReactNode } from 'react'
import BaseRepositoryTableHeader from './BaseRepositoryTableHeader'

interface Column<T> {
  key: keyof T
  header: string
  align?: 'left' | 'center' | 'right'
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

export default function BaseRepositoryTable<
  T extends { id: string; url: string },
>({ title, description, icon, data, columns }: BaseRepositoryTableProps<T>) {
  if (data.length === 0) return null

  return (
    <div className="bg-background border border-foreground/20 rounded-lg shadow-sm">
      <BaseRepositoryTableHeader
        title={title}
        description={description}
        icon={icon}
        length={data.length}
      />
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-foreground/5">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`px-6 py-3 text-xs font-medium text-foreground/60 uppercase tracking-wider ${
                    column.align === 'center'
                      ? 'text-center'
                      : column.align === 'right'
                        ? 'text-right'
                        : 'text-left'
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
                      column.align === 'center'
                        ? 'text-center'
                        : column.align === 'right'
                          ? 'text-right'
                          : 'text-left'
                    }`}
                  >
                    {column.render
                      ? column.render(item[column.key], item)
                      : String(item[column.key])}
                  </td>
                ))}
                <td className="px-6 py-4 text-center">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-foreground/10 transition-colors text-foreground/60 hover:text-foreground"
                  >
                    <ExternalLink className="h-4 w-4" />
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
