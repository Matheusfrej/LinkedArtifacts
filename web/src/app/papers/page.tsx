'use client'
import { useState, useMemo } from 'react'
import SearchBar from './components/SearchBar'
import Link from 'next/link'

const papers = [
  'corner. py: Scatterplot matrices in Python.',
  'corner. py: Corner plots',
  'Advanced visualization',
  'The Journal of Open Source Software',
  'kalepy: A Python package for kernel density estimation, sampling and plotting',
  'uravu: Making Bayesian modelling easy (er)',
  'Probing New physics with high-redshift quasars: axions and non-standard cosmology',
  'Probing new physics with high-redshift quasars: axions and non-standard cosmology',
]

export default function Page() {
  const [query, setQuery] = useState('')

  const filteredPapers = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return papers
    return papers.filter((paper) => paper.toLowerCase().includes(q))
  }, [query])

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
          filteredPapers.map((paper, index) => (
            <li key={paper + index} className="mb-8 text-left pl-8">
              <Link
                href={`/papers/${encodeURIComponent(paper)}`}
                className="text-[20px] font-serif leading-snug hover:underline cursor-pointer text-[#1a0dab] dark:text-[#8ab4f8]"
                tabIndex={0}
              >
                {paper}
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
