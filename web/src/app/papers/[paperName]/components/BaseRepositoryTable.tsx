import { ExternalLink } from 'lucide-react'
import type { ReactNode } from 'react'
import BaseRepositoryTableHeader from './BaseRepositoryTableHeader'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'components/ui/Table'

interface Column<T> {
  key: keyof T
  header: string | ReactNode
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
        <Table>
          <TableHeader className="bg-foreground/5">
            <TableRow>
              <TableHead>Link</TableHead>
              {columns.map((column) => (
                <TableHead
                  key={String(column.key)}
                  className={`${
                    column.align === 'center'
                      ? 'text-center'
                      : column.align === 'right'
                        ? 'text-right'
                        : 'text-left'
                  }`}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    {item.url}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </TableCell>
                {columns.map((column) => (
                  <TableCell
                    key={String(column.key)}
                    className={`${
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
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
