import api from '..'

export interface UnvoteDownRequest {
  paperName: string
}

export async function unvoteDown({
  paperName,
}: UnvoteDownRequest): Promise<void> {
  const url = `/artifacts/${encodeURIComponent(paperName)}/unvoteDown`
  await api.post(url)
}
