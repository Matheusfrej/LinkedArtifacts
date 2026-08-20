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
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-tight">
        {paper.title}
      </h1>

      {/* Authors List */}
      {authorsList.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-foreground/90">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Authors:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {authorsList.map((author, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-foreground/5 text-foreground text-xs sm:text-sm font-medium"
              >
                <User className="w-3.5 h-3.5 text-muted-foreground" />
                {author}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Publication Venue, Year, Pages & DOI Card */}
      <div className="p-4 sm:p-5 rounded-xl border border-border/60 bg-card/60 backdrop-blur-xs space-y-3">
        {paper.venue && (
          <div className="flex items-start gap-2.5 text-sm text-foreground leading-relaxed">
            <BookOpen className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <span className="font-medium text-foreground">{paper.venue}</span>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-muted-foreground pt-1 border-t border-border/40">
          {paper.year && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>Published: <strong>{paper.year}</strong></span>
            </div>
          )}

          {paper.pageCount && paper.pageCount > 0 ? (
            <div className="flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span>
                {paper.pageCount} {paper.pageCount === 1 ? 'page' : 'pages'}
              </span>
            </div>
          ) : null}

          {doiUrl && (
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={handleCopyDoi}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-foreground/5"
                title="Copy DOI Link"
                type="button"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                      Copied!
                    </span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy DOI</span>
                  </>
                )}
              </button>

              <a
                href={doiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                <span>View on DOI</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
