import api from '..'

export interface VoteUpRequest {
  paperName: string
}

export async function voteUp({ paperName }: VoteUpRequest): Promise<void> {
  const url = `/artifacts/${encodeURIComponent(paperName)}/voteUp`
  await api.post(url)
}
