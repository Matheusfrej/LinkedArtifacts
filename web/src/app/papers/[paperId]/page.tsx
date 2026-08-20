'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { findPaperById, type Paper } from '@/lib/service/papers'
import PaperHeader from './components/PaperHeader'
import PaperBadges from './components/PaperBadges'
import { AppError } from '@/utils/AppError'
import ArtifactTable from './components/ArtifactTable'

interface PageProps {
  params: Promise<{ paperId: number }>
}

export default function Page({ params }: PageProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [paper, setPaper] = useState<Paper | null>(null)
  const { paperId } = React.use(params)

  useEffect(() => {
    let cancelled = false
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const paperRes = await findPaperById({ id: Number(paperId) })
        if (!cancelled) setPaper(paperRes)
      } catch (err: unknown) {
        console.error(err)
        if (!cancelled)
          setError((err as AppError)?.message || 'Failed to fetch paper details')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchData()
    return () => {
      cancelled = true
    }
  }, [paperId])

  if (loading) {
    return (
      <div className="py-8 space-y-6 animate-pulse">
        <div className="h-4 w-28 bg-muted rounded"></div>
        <div className="h-10 w-3/4 bg-muted rounded"></div>
        <div className="h-5 w-1/2 bg-muted rounded"></div>
        <div className="h-28 w-full bg-muted rounded-xl"></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="h-36 bg-muted rounded-xl"></div>
          <div className="h-36 bg-muted rounded-xl"></div>
          <div className="h-36 bg-muted rounded-xl"></div>
        </div>
      </div>
    )
  }

  if (error || !paper) {
    return (
      <div className="py-12 space-y-4">
        <Link
          href="/papers"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to papers</span>
        </Link>
        <div className="p-6 rounded-xl border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400">
          <h2 className="font-semibold text-base mb-1">Error loading paper</h2>
          <p className="text-sm">{error || 'Paper not found.'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-6 sm:py-8 space-y-8">
      {/* Navigation back */}
      <div>
        <Link
          href="/papers"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to papers</span>
        </Link>
      </div>

      {/* Main Paper Header */}
      <PaperHeader paper={paper} />

      {/* Badges & Reproducibility Showcase */}
      <PaperBadges badges={paper.badges} hasArtifact={paper.hasArtifact} />

      {/* Artifacts Repository Table */}
      <section className="space-y-3" aria-labelledby="paper-artifacts-heading">
        <ArtifactTable data={paper.artifacts ?? []} />
      </section>
    </div>
  )
}
