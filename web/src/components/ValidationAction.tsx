'use client'
import { useState } from 'react'
import { ThumbsUp, ThumbsDown, CheckCircle } from 'lucide-react'
import { ArtifactValidation } from '../app/@types/types'

interface ValidationActionProps {
  artifactId: string
  validation?: ArtifactValidation
  onVote?: (
    type: 'up' | 'down' | null,
    options: { increasing: boolean },
  ) => Promise<void>
}

export default function ValidationAction({
  artifactId,
  validation,
  onVote,
}: ValidationActionProps) {
  const [isVoting, setIsVoting] = useState(false)
  const [currentVote, setCurrentVote] = useState<'up' | 'down' | null>(null)
  const [increasing, setIncreasing] = useState<boolean>(true)

  const handleVote = async (type: 'up' | 'down') => {
    if (isVoting || !validation || validation.type !== 'automatic') return

    setIsVoting(true)
    const inc = currentVote !== type

    try {
      setIncreasing(inc)
      if (!inc) {
        setCurrentVote(null)
      } else {
        setCurrentVote(type)
      }
      await onVote?.(type, { increasing: inc })
    } catch (error) {
      // Revert on error
      setCurrentVote(currentVote)
    } finally {
      setIsVoting(false)
    }
  }

  if (!validation) return null

  if (validation.type === 'manual') {
    return (
      <div className="flex items-center justify-end gap-1 text-emerald-600 dark:text-emerald-500">
        <CheckCircle className="w-5 h-5" />
        <span className="text-sm">Verified</span>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-end gap-4">
      <button
        onClick={() => handleVote('up')}
        disabled={isVoting}
        className={`flex items-center gap-1 ${
          currentVote === 'up' && increasing
            ? 'text-emerald-600 dark:text-emerald-500'
            : 'text-gray-600 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-500'
        } disabled:opacity-50 disabled:hover:text-current`}
      >
        <ThumbsUp className="w-4 h-4" />
        <span className="text-sm">{validation.ups}</span>
      </button>
      <button
        onClick={() => handleVote('down')}
        disabled={isVoting}
        className={`flex items-center gap-1 ${
          currentVote === 'down' && increasing
            ? 'text-red-600 dark:text-red-500'
            : 'text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500'
        } disabled:opacity-50 disabled:hover:text-current`}
      >
        <ThumbsDown className="w-4 h-4" />
        <span className="text-sm">{validation.downs}</span>
      </button>
    </div>
  )
}
