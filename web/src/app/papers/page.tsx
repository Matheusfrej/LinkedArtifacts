'use client'
import { useState, useMemo, useEffect } from 'react'
import SearchBar from './components/SearchBar'
import Link from 'next/link'
import { listPapers } from '@/lib/service/papers'
import { AppError } from '@/utils/AppError'
import ArtifactFilter from './components/ArtifactFilter'

export default function Page() {
  const [query, setQuery] = useState('')
  const [onlyWithArtifact, setOnlyWithArtifact] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [papers, setPapers] = useState<
    {
      id: number
      title: string
      hasArtifact: boolean
    }[]
  >([])

  const filteredPapers = useMemo(() => {
    const q = query.trim().toLowerCase()

    return papers.filter((paper) => {
      const matchesQuery = !q || paper.title.toLowerCase().includes(q)
      const matchesArtifact = !onlyWithArtifact || paper.hasArtifact
      return matchesQuery && matchesArtifact
    })
  }, [papers, query, onlyWithArtifact])

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
      <div className="flex flex-col justify-end items-end">
        <ArtifactFilter
          checked={onlyWithArtifact}
          onChange={setOnlyWithArtifact}
        />
      </div>
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

                {paper.hasArtifact && (
                  <span
                    title="Show Artifacts"
                    style={{
                      marginLeft: '8px',
                      display: 'inline-block',
                      verticalAlign: 'middle',
                      width: '24px',
                      height: '24px',
                      background:
                        "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%234285f4'><circle cx='12' cy='12' r='10' fill='%234285f4'/><text x='12' y='16' text-anchor='middle' font-size='12' fill='white'>A</text></svg>\") no-repeat center/contain",
                      cursor: 'pointer',
                    }}
                  />
                )}
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
