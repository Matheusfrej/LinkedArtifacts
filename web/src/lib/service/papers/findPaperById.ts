import api from '..'

export interface FindPaperByIdRequest {
  id: number
}

export type FindPaperByIdResponse = {
  id: number
  title: string
  doi?: string
}

export async function findPaperById(
  params: FindPaperByIdRequest,
): Promise<FindPaperByIdResponse> {
  const url = `/papers/${params.id}`
  console.log(url)
  const { data } = await api.get(url)
  console.log({ url, input: params, output: data })
  return data
}
