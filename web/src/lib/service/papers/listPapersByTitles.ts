import api from '..'

export interface ListPapersByTitlesRequest {
  titles: string[]
}

type Paper = {
  id: number
  title: string
  artifacts: {
    id: number
    name: string
    url: string
  }[]
}

export type ListPapersByTitlesResponse = Paper[]

export async function listPapersByTitles(
  params: ListPapersByTitlesRequest,
): Promise<ListPapersByTitlesResponse> {
  const url = `/papers/by-titles`
  const { data } = await api.post(url, params)
  console.log({ url, input: params, output: data })
  return data
}
