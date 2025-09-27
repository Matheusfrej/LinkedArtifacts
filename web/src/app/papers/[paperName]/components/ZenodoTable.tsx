import BaseRepositoryTable from "./BaseRepositoryTable"

export interface ZenodoArtifact {
  id: string
  title: string
  version: string
  license: string
  views: number
  downloads: number
  citations: number
  url: string
}

interface ZenodoTableProps {
  data: ZenodoArtifact[]
}

export default function ZenodoTable({ data }: ZenodoTableProps) {
  const columns = [
    {
      key: "title" as const,
      header: "Title",
      render: (value: string) => <span className="font-medium text-foreground">{value}</span>,
    },
    {
      key: "version" as const,
      header: "Version",
      render: (value: string) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300">
          {value}
        </span>
      ),
    },
    {
      key: "license" as const,
      header: "License",
      render: (value: string) => <span className="text-foreground">{value}</span>,
    },
    {
      key: "views" as const,
      header: "Views",
      align: "right" as const,
      render: (value: number) => (
        <div className="flex items-center justify-end gap-1">
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          {value.toLocaleString()}
        </div>
      ),
    },
    {
      key: "downloads" as const,
      header: "Downloads",
      align: "right" as const,
      render: (value: number) => (
        <div className="flex items-center justify-end gap-1">
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          {value.toLocaleString()}
        </div>
      ),
    },
    {
      key: "citations" as const,
      header: "Citations",
      align: "right" as const,
      render: (value: number) => <span className="text-foreground">{value}</span>,
    },
  ]

  return (
    <BaseRepositoryTable
      title="Zenodo"
      description="Table with Zenodo artifacts from paper with associated metadata"
      icon={
        <svg className="h-5 w-5 text-foreground/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      }
      data={data}
      columns={columns}
    />
  )
}
