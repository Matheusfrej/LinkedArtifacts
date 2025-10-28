'use client'
import { useEffect, useState } from 'react'
import { listByPaperName } from '@/lib/service/artifacts/listByPaperName'
import ZenodoTable from '../components/ZenodoTable'
import GitHubTable from '../components/GitHubTable'
import FigshareTable from '../components/FigshareTable'
import OtherRepositoriesTable from '../components/OtherRepositoriesTable'
import {
  FigshareArtifact,
  GitHubArtifact,
  OtherRepository,
  ZenodoArtifact,
} from '@/@types'

interface Props {
  paperName: string
}

export default function PaperDetailClient({ paperName }: Props) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<{
    zenodo: ZenodoArtifact[]
    figshare: FigshareArtifact[]
    github: GitHubArtifact[]
    other: OtherRepository[]
  }>({ zenodo: [], figshare: [], github: [], other: [] })

  useEffect(() => {
    let cancelled = false
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await listByPaperName({ paperName })
        if (!cancelled)
          setData({
            zenodo: res.artifacts?.zenodo,
            github: res.artifacts?.github,
            figshare: res.artifacts?.figshare,
            other: res.artifacts?.other,
          })
      } catch (err: unknown) {
        console.error(err)
        if (!cancelled)
          setError((err as Error)?.message || 'Failed to fetch data')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchData()
    return () => {
      cancelled = true
    }
  }, [paperName])

  if (loading) return <div className="py-8">Loading artifacts…</div>
  if (error)
    return (
      <div className="py-8 text-red-500">Error loading artifacts: {error}</div>
    )

  const mockZenodoArtifacts: ZenodoArtifact[] = data?.zenodo
  const mockGitHubArtifacts: GitHubArtifact[] = data?.github
  const mockFigshareArtifacts: FigshareArtifact[] = data?.figshare
  const mockOtherRepositories: OtherRepository[] = data?.other

  return (
    <div className="py-8 space-y-8 max-w-6xl mx-auto px-4">
      <ZenodoTable paperName={paperName} data={mockZenodoArtifacts} />
      <GitHubTable paperName={paperName} data={mockGitHubArtifacts} />
      <FigshareTable paperName={paperName} data={mockFigshareArtifacts} />
      <OtherRepositoriesTable
        paperName={paperName}
        data={mockOtherRepositories}
      />

      {mockZenodoArtifacts.length === 0 &&
        mockGitHubArtifacts.length === 0 &&
        mockFigshareArtifacts.length === 0 &&
        mockOtherRepositories.length === 0 && (
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
