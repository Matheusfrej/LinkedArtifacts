import { type NextRequest } from 'next/server'
import { type AutomaticValidation } from '../../../../@types/types'
import { VoteArtifactRequest } from '../../../../../lib/service/artifacts'

// Mock storage
const mockVotes: Record<
  string,
  { validation: AutomaticValidation; lastVote: 'up' | 'down' | null }
> = {}

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const body = (await _request.json()) as VoteArtifactRequest

  if (!mockVotes[params.id]) {
    mockVotes[params.id] = {
      validation: {
        type: 'automatic',
        ups: 0,
        downs: 0,
      },
      lastVote: null,
    }
  }

  const current = mockVotes[params.id]
  const lastVote = current.lastVote

  // If clicking the same vote type, remove it (subtract)
  if (body.type === lastVote && !body.increasing) {
    if (body.type === 'up') {
      current.validation.ups = Math.max(0, current.validation.ups - 1)
    } else if (body.type === 'down') {
      current.validation.downs = Math.max(0, current.validation.downs - 1)
    }
    current.lastVote = null
  }
  // If changing vote type, remove old and add new
  else if (lastVote && body.type) {
    if (lastVote === 'up') {
      current.validation.ups = Math.max(0, current.validation.ups - 1)
      current.validation.downs += 1
    } else {
      current.validation.downs = Math.max(0, current.validation.downs - 1)
      current.validation.ups += 1
    }
    current.lastVote = body.type
  }
  // If no previous vote, simply add the new vote
  else if (body.type) {
    if (body.type === 'up') {
      current.validation.ups += 1
    } else {
      current.validation.downs += 1
    }
    current.lastVote = body.type
  }

  return Response.json(current.validation)
}
