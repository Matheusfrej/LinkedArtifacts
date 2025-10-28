import api from '..'
import type {
  ZenodoArtifact,
  GitHubArtifact,
  FigshareArtifact,
  OtherRepository,
} from '../../../app/@types/types'

export interface ListByPaperNameRequest {
  paperName: string
}

export interface ListByPaperNameResponse {
  artifacts: {
    zenodo: ZenodoArtifact[]
    github: GitHubArtifact[]
    figshare: FigshareArtifact[]
    other: OtherRepository[]
  }
}

export async function listByPaperName(
  params: ListByPaperNameRequest,
): Promise<ListByPaperNameResponse> {
  const url = `/artifacts/${encodeURIComponent(params.paperName)}`
  const { data } = await api.get(url)
  console.log({ url, input: params, output: data })
  return data
}
