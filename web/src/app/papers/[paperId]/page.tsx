'use client'
import React, { useEffect, useState } from 'react'
import { findPaperById } from '@/lib/service/papers'
import PaperDetail from './components/PaperDetail'
import { AppError } from '@/utils/AppError'

interface PageProps {
  params: Promise<{ paperId: number }>
}

export default function Page({ params }: PageProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [paperTitle, setPaperTitle] = useState<string | undefined>()
  const { paperId } = React.use(params)
  useEffect(() => {
    let cancelled = false
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const paper = await findPaperById({ id: paperId })
        if (!cancelled) setPaperTitle(paper.title)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) return <div className="py-8">Loading paper information...</div>
  if (error)
    return (
      <div className="py-8 text-red-500">
        Error loading paper information: {error}
      </div>
    )

  return (
    <div className="py-8 space-y-8 max-w-6xl mx-auto px-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">{paperTitle}</h1>
        <h2 className="text-xl text-foreground/70">Artifacts</h2>
      </div>

      <PaperDetail paperId={paperId} />
    </div>
  )
}
