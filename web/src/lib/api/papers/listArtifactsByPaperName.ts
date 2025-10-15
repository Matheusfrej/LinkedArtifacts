import api from '..'

interface ZenodoArtifact {
  id: string
  title: string
  version: string
  license: string
  views: number
  downloads: number
  citations: number
  url: string
}

interface GitHubArtifact {
  id: string
  name: string
  license: string
  stars: number
  forks: number
  url: string
}

interface FigshareArtifact {
  id: string
  title: string
  license: string
  views: number
  downloads: number
  citations: number
  url: string
}

interface OtherRepository {
  id: string
  url: string
}

export interface ListArtifactsByPaperNameRequest {
  paperName: string
}

export interface ListArtifactsByPaperNameResponse {
  artifacts: {
    zenodo: ZenodoArtifact[]
    github: GitHubArtifact[]
    figshare: FigshareArtifact[]
    other: OtherRepository[]
  }
}

export async function listArtifactsByPaperName(
  params: ListArtifactsByPaperNameRequest,
): Promise<ListArtifactsByPaperNameResponse> {
  const url = `/papers/${encodeURIComponent(params.paperName)}`
  const { data } = await api.get(url)
  console.log({ url, input: params, output: data })
  return data
}
