'use client'
import { useState, useMemo, useEffect } from 'react'
import SearchBar from './components/SearchBar'
import Link from 'next/link'
import { listPapers } from '@/lib/service/papers'
import { AppError } from '@/utils/AppError'

export default function Page() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [papers, setPapers] = useState<
    {
      id: number
      title: string
    }[]
  >([])

  const filteredPapers = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return papers
    return papers.filter((paper) => paper.title.toLowerCase().includes(q))
  }, [papers, query])

  useEffect(() => {
    let cancelled = false
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await listPapers()
        if (!cancelled) setPapers(res)
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
  }, [])

  if (loading) return <div className="py-8">Loading papers...</div>
  if (error)
    return (
      <div className="py-8 text-red-500">Error loading papers: {error}</div>
    )

  return (
    <div className="py-8">
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search papers..."
      />
      <ul>
        {filteredPapers.length === 0 ? (
          <li className="text-center text-gray-500 dark:text-gray-400">
            No papers found.
          </li>
        ) : (
          filteredPapers.map((paper) => (
            <li key={paper.id} className="mb-8 text-left pl-8">
              <Link
                href={`/papers/${paper.id}`}
                className="text-[20px] font-serif leading-snug hover:underline cursor-pointer text-[#1a0dab] dark:text-[#8ab4f8]"
                tabIndex={0}
              >
                {paper.title}
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
