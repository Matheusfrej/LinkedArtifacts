import api from '..'

export interface ListArtifactsByPaperIdRequest {
  paperId: number
}

type Artifact = {
  id: number
  name?: string
  url: string
  paperId: number
}

export type ListArtifactsByPaperIdResponse = Artifact[]

export async function listArtifactsByPaperId(
  params: ListArtifactsByPaperIdRequest,
): Promise<ListArtifactsByPaperIdResponse> {
  const url = `/artifacts`
  const { data } = await api.get(url, { params: { paperId: params.paperId } })
  console.log({ url, input: params, output: data })
  return data
}
