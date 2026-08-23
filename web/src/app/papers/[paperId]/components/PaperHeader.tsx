'use client'

import { useState } from 'react'
import {
  BookOpen,
  Calendar,
  Check,
  Copy,
  ExternalLink,
  FileText,
  User,
} from 'lucide-react'
import type { Paper } from '@/lib/service/papers'

interface PaperHeaderProps {
  paper: Paper
}

export default function PaperHeader({ paper }: PaperHeaderProps) {
  const [copied, setCopied] = useState(false)

  const authorsList = paper.authors
    ? paper.authors
        .split(';')
        .map((a) => a.trim())
        .filter(Boolean)
    : []

  const doiUrl = paper.doi
    ? paper.doi.startsWith('http://') || paper.doi.startsWith('https://')
      ? paper.doi
      : `https://doi.org/${paper.doi}`
    : null

  const handleCopyDoi = async () => {
    if (!doiUrl) return
    try {
      await navigator.clipboard.writeText(doiUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy DOI:', err)
    }
  }

  return (
    <div className="space-y-5">
      {/* Category / Access Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/40 pb-3">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold tracking-wide uppercase">
          <span className="px-2.5 py-1 rounded bg-muted text-muted-foreground">
            Research Article
          </span>
          {paper.hasArtifact && (
            <span className="px-2.5 py-1 rounded bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-medium">
              Artifacts Linked
            </span>
          )}
        </div>
      </div>

      {/* Main Title */}
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-foreground leading-tight break-words">
        {paper.title}
      </h1>

      {/* Authors List */}
      {authorsList.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-3 text-sm text-foreground/90">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider shrink-0">
            Authors:
          </span>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {authorsList.map((author, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-foreground/5 text-foreground text-xs sm:text-sm font-medium break-words"
              >
                <User className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span>{author}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Publication Venue, Year, Pages & DOI Card */}
      <div className="p-3.5 sm:p-5 rounded-xl border border-border/60 bg-card/60 backdrop-blur-xs space-y-3">
        {paper.venue && (
          <div className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground leading-relaxed">
            <BookOpen className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <span className="font-medium text-foreground">{paper.venue}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-border/40">
          <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-1.5 text-xs sm:text-sm text-muted-foreground">
            {paper.year && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                <span>
                  Published: <strong>{paper.year}</strong>
                </span>
              </div>
            )}

            {paper.pageCount && paper.pageCount > 0 ? (
              <div className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                <span>
                  {paper.pageCount} {paper.pageCount === 1 ? 'page' : 'pages'}
                </span>
              </div>
            ) : null}
          </div>

          {doiUrl && (
            <div className="flex flex-wrap items-center gap-2 pt-1 sm:pt-0">
              <button
                onClick={handleCopyDoi}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1 rounded-md hover:bg-foreground/5 cursor-pointer"
                title="Copy DOI Link"
                type="button"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                      Copied!
                    </span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 shrink-0" />
                    <span>Copy DOI</span>
                  </>
                )}
              </button>

              <a
                href={doiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer shrink-0"
              >
                <span>View on DOI</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
