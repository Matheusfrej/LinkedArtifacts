import api from '..'

export interface UnvoteUpRequest {
  paperName: string
}

export async function unvoteUp({ paperName }: UnvoteUpRequest): Promise<void> {
  const url = `/artifacts/${encodeURIComponent(paperName)}/unvoteUp`
  await api.post(url)
}
