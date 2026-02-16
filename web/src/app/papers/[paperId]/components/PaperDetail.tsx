'use client'
import { useEffect, useState } from 'react'
import { listArtifactsByPaperId } from '@/lib/service/artifacts/listArtifactsByPaperId'
import { AppError } from '@/utils/AppError'
import ArtifactTable from './ArtifactTable'

interface Props {
  paperId: number
}

export default function PaperDetail({ paperId }: Props) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<
    {
      id: number
      name?: string
      url: string
    }[]
  >([])

  useEffect(() => {
    let cancelled = false
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await listArtifactsByPaperId({ paperId })
        if (!cancelled) setData(res)
      } catch (err: unknown) {
        console.error(err)
        if (!cancelled)
          setError((err as AppError)?.message || 'Failed to fetch data')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchData()
    return () => {
      cancelled = true
    }
  }, [paperId])

  if (loading) return <div className="py-8">Loading artifacts…</div>
  if (error)
    return (
      <div className="py-8 text-red-500">Error loading artifacts: {error}</div>
    )

  return (
    <div className="py-8 space-y-8 max-w-6xl mx-auto px-4">
      <ArtifactTable data={data} />

      {data.length === 0 && (
        <div className="bg-background border border-foreground/20 rounded-lg shadow-sm">
          <div className="py-12 text-center">
            <p className="text-foreground/60">
              No artifacts found for this paper.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
