import api from '..'
import { AutomaticValidation } from '../../../app/@types/types'

export interface VoteArtifactRequest {
  artifactId: string
  type: 'up' | 'down' | null
  increasing: boolean
}

export async function vote({
  artifactId,
  type,
  increasing,
}: VoteArtifactRequest): Promise<AutomaticValidation> {
  const url = `/artifacts/${encodeURIComponent(artifactId)}/vote`
  const payload: VoteArtifactRequest = { artifactId, type, increasing }
  const { data } = await api.post(url, payload)
  return data
}
