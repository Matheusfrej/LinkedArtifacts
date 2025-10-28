'use client'
import { useState } from 'react'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { ArtifactValidation, AutomaticValidation } from '../@types'
import {
  unvoteDown,
  unvoteUp,
  voteDown,
  voteUp,
} from '../lib/service/artifacts'
import { ArtifactVerified } from './ArtifactVerified'

interface ValidationActionProps {
  paperName: string
  initialValidation?: ArtifactValidation
}

export default function ValidationAction({
  paperName,
  initialValidation,
}: ValidationActionProps) {
  const [isVoting, setIsVoting] = useState(false)
  const [validation, setValidation] = useState(initialValidation)
  const [active, setActive] = useState<'up' | 'down' | null>(null)

  const handleVote = async (type: 'up' | 'down') => {
    if (isVoting || !validation || validation.type !== 'automatic') return
    setIsVoting(true)

    try {
      const newVal: AutomaticValidation = validation
      if (type === 'up' && (!active || active === 'down')) {
        await voteUp({ paperName })
        newVal.ups = validation.ups + 1
        newVal.downs =
          active === 'down' ? validation.downs - 1 : validation.downs
        setValidation(newVal)
      } else if (type === 'down' && (!active || active === 'up')) {
        await voteDown({ paperName })
        newVal.ups = active === 'up' ? validation.ups - 1 : validation.ups
        newVal.downs = validation.downs + 1
      } else if (type === 'up' && active === 'up') {
        await unvoteUp({ paperName })
        newVal.ups = validation.ups - 1
      } else if (type === 'down' && active === 'down') {
        await unvoteDown({ paperName })
        newVal.downs = validation.downs - 1
      }
      setValidation(newVal)

      if (type === active) {
        setActive(null)
      } else {
        setActive(type)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsVoting(false)
    }
  }

  if (!validation) return null

  if (validation.type === 'manual') {
    return (
      <div className="flex items-center justify-end">
        <ArtifactVerified />
      </div>
    )
  }

  return (
    <div className="flex items-center justify-end gap-4">
      <button
        onClick={() => handleVote('up')}
        disabled={isVoting}
        className={`flex items-center gap-1 ${
          active === 'up'
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
          active === 'down'
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
