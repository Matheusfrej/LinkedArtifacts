import BaseRepositoryTable from "./BaseRepositoryTable"
import { Eye, Download, Database } from "lucide-react"

export interface FigshareArtifact {
  id: string
  title: string
  license: string
  views: number
  downloads: number
  citations: number
  url: string
}

interface FigshareTableProps {
  data: FigshareArtifact[]
}

export default function FigshareTable({ data }: FigshareTableProps) {
  const columns = [
    {
      key: "title" as const,
      header: "Title",
      render: (value: string) => <span className="font-medium text-foreground">{value}</span>,
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
          <Eye className="h-3 w-3" />
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
          <Download className="h-3 w-3" />
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
      title="Figshare"
      description="Table with Figshare artifacts from paper with associated metadata"
      icon={<Database className="h-5 w-5 text-foreground/70" />}
      data={data}
      columns={columns}
    />
  )
}
