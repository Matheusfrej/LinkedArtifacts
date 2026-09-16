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
} from '@/components/ui/Table'

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
  T extends { id: number; url: string },
>({ title, description, icon, data, columns }: BaseRepositoryTableProps<T>) {
  if (data.length === 0) return null

  return (
    <div className="bg-card border border-border/80 rounded-xl shadow-xs overflow-hidden">
      <BaseRepositoryTableHeader
        title={title}
        description={description}
        icon={icon}
        length={data.length}
      />
      <div className="overflow-x-auto w-full">
        <Table className="min-w-full">
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold">
                Link
              </TableHead>
              {columns.map((column) => (
                <TableHead
                  key={String(column.key)}
                  className={`px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold ${
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
              <TableRow key={item.id} className="hover:bg-muted/30">
                <TableCell className="px-3 sm:px-4 py-2.5 sm:py-3">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={item.url}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-primary hover:underline transition-colors font-medium max-w-[220px] xs:max-w-xs sm:max-w-md md:max-w-lg truncate"
                  >
                    <span className="truncate">{item.url}</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-70" />
                  </a>
                </TableCell>
                {columns.map((column) => (
                  <TableCell
                    key={String(column.key)}
                    className={`px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm ${
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
