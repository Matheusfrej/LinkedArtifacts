import api from '..'

type Paper = {
  id: number
  title: string
  doi?: string
  createdAt?: Date
}

export type ListPapersResponse = Paper[]

export async function listPapers(): Promise<ListPapersResponse> {
  const url = `/papers`
  const { data } = await api.get(url)
  console.log({ url, output: data })
  return data
}
