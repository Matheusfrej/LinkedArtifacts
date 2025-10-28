import api from '..'

export interface VoteDownRequest {
  paperName: string
}

export async function voteDown({ paperName }: VoteDownRequest): Promise<void> {
  const url = `/artifacts/${encodeURIComponent(paperName)}/voteDown`
  await api.post(url)
}
