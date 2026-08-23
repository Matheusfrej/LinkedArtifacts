'use client'
import { useState, useMemo, useEffect } from 'react'
import SearchBar from './components/SearchBar'
import Link from 'next/link'
import Image from 'next/image'
import { listPapers, type Paper } from '@/lib/service/papers'
import { AppError } from '@/utils/AppError'
import ArtifactFilter, {
  type ArtifactFilterValue,
} from './components/ArtifactFilter'
import PaperSort, { type SortOption } from './components/PaperSort'

export default function Page() {
  const [query, setQuery] = useState('')
  const [selectedFilters, setSelectedFilters] = useState<ArtifactFilterValue[]>(
    [],
  )
  const [sortBy, setSortBy] = useState<SortOption>('default')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [papers, setPapers] = useState<Paper[]>([])

  const filteredPapers = useMemo(() => {
    const q = query.trim().toLowerCase()

    const filtered = papers.filter((paper) => {
      const matchesQuery =
        !q ||
        paper.title.toLowerCase().includes(q) ||
        paper.authors.toLowerCase().includes(q) ||
        paper.venue.toLowerCase().includes(q) ||
        paper.year.toString().includes(q) ||
        paper.doi?.toLowerCase().includes(q)

      const matchesFilter =
        selectedFilters.length === 0 ||
        selectedFilters.every((filter) =>
          filter === 'artifact'
            ? paper.hasArtifact
            : paper.badges.some((badge) => badge.name === filter),
        )
      return matchesQuery && matchesFilter
    })

    if (sortBy === 'default') {
      return filtered
    }

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'year-desc':
          return (b.year || 0) - (a.year || 0)
        case 'year-asc':
          return (a.year || 0) - (b.year || 0)
        case 'title-asc':
          return a.title.localeCompare(b.title, undefined, {
            sensitivity: 'base',
            numeric: true,
          })
        case 'title-desc':
          return b.title.localeCompare(a.title, undefined, {
            sensitivity: 'base',
            numeric: true,
          })
        case 'venue-asc':
          return (a.venue || '').localeCompare(b.venue || '', undefined, {
            sensitivity: 'base',
            numeric: true,
          })
        case 'venue-desc':
          return (b.venue || '').localeCompare(a.venue || '', undefined, {
            sensitivity: 'base',
            numeric: true,
          })
        default:
          return 0
      }
    })
  }, [papers, query, selectedFilters, sortBy])

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

  const badgeNameToFileName = {
    Available: 'available',
    'Evaluated & Functional': 'functional',
    'Evaluated & Reusable': 'reusable',
    'Results Reproduced': 'reproduced',
    'Results Replicated': 'replicated',
  } as const

  const formatAuthors = (authors?: string | null): string => {
    if (!authors) return ''
    return authors
      .split(';')
      .map((a) => a.trim())
      .filter(Boolean)
      .join(', ')
  }

  const formatMetadata = (paper: Paper): string => {
    const authorText = formatAuthors(paper.authors)
    const venueYear = [paper.venue, paper.year].filter(Boolean).join(', ')
    const pagesText =
      paper.pageCount && paper.pageCount > 0
        ? `${paper.pageCount} ${paper.pageCount === 1 ? 'page' : 'pages'}`
        : ''

    return [authorText, venueYear, pagesText].filter(Boolean).join(' - ')
  }

  const getDoiUrl = (doi: string): string => {
    if (doi.startsWith('http://') || doi.startsWith('https://')) {
      return doi
    }
    return `https://doi.org/${doi}`
  }

  return (
    <div className="py-4 sm:py-8">
      <SearchBar value={query} onChange={setQuery} />

      {/* Control Bar: Counter, Filters & Sorting */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex flex-row items-center justify-between gap-3 border-b border-border/40 pb-3">
          <div className="text-xs sm:text-sm text-muted-foreground font-medium">
            {papers.length > 0 && (
              <span>
                {filteredPapers.length === papers.length
                  ? `${papers.length} ${papers.length === 1 ? 'paper' : 'papers'}`
                  : `Showing ${filteredPapers.length} of ${papers.length} papers`}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <PaperSort value={sortBy} onChange={setSortBy} />
          </div>
        </div>

        <div className="w-full">
          <ArtifactFilter
            selected={selectedFilters}
            onChange={setSelectedFilters}
          />
        </div>
      </div>

      <ul className="space-y-5 sm:space-y-6">
        {filteredPapers.length === 0 ? (
          <li className="text-center text-muted-foreground py-8 sm:py-12 text-sm sm:text-base border border-dashed border-border/60 rounded-xl">
            No papers found matching your criteria.
          </li>
        ) : (
          filteredPapers.map((paper) => (
            <li
              key={paper.id}
              className="text-left pb-4 border-b border-border/40 last:border-b-0"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <Link
                      href={`/papers/${paper.id}`}
                      className="text-base sm:text-lg md:text-[19px] font-medium leading-snug hover:underline cursor-pointer text-[#1a0dab] dark:text-[#8ab4f8] break-words"
                      tabIndex={0}
                    >
                      {paper.title}
                    </Link>

                    {(paper.hasArtifact ||
                      (paper.badges && paper.badges.length > 0)) && (
                      <span className="inline-flex items-center gap-1.5 align-middle self-center shrink-0">
                        {paper.hasArtifact && (
                          <Image
                            src="/icons/artifact/icon.svg"
                            alt="Show Artifacts"
                            title="Show Artifacts"
                            width={18}
                            height={18}
                            className="w-4.5 h-4.5 sm:w-5 sm:h-5 cursor-pointer shrink-0"
                          />
                        )}

                        {paper.badges?.map((badge) => {
                          const fileName =
                            badgeNameToFileName[
                              badge.name as keyof typeof badgeNameToFileName
                            ]
                          if (!fileName) return null

                          return (
                            <Image
                              key={badge.id}
                              src={`/icons/artifact/${fileName}.svg`}
                              alt={`Artifact ${badge.name}`}
                              title={`Artifact ${badge.name}`}
                              width={18}
                              height={18}
                              className="w-4.5 h-4.5 sm:w-5 sm:h-5 shrink-0"
                            />
                          )
                        })}
                      </span>
                    )}
                  </div>

                  {formatMetadata(paper) && (
                    <div className="text-xs sm:text-[14px] text-[#006621] dark:text-[#68b688] leading-relaxed mt-1 break-words">
                      {formatMetadata(paper)}
                    </div>
                  )}
                </div>

                {paper.doi && (
                  <div className="shrink-0 self-start sm:self-auto pt-0.5">
                    <a
                      href={getDoiUrl(paper.doi)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-[14px] text-[#1a0dab] hover:underline dark:text-[#8ab4f8] inline-flex items-center gap-1 font-medium px-2 py-0.5 rounded bg-muted/40 sm:bg-transparent"
                      title={`Open DOI: ${paper.doi}`}
                    >
                      <span className="font-bold">[PDF]</span>
                      <span>doi.org</span>
                    </a>
                  </div>
                )}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
