export interface BaseArtifactValidation {
  type: 'manual' | 'automatic'
}

export interface ManualValidation extends BaseArtifactValidation {
  type: 'manual'
  verifiedBy: string
  verifiedAt: string
}

export interface AutomaticValidation extends BaseArtifactValidation {
  type: 'automatic'
  ups: number
  downs: number
}

export type ArtifactValidation = ManualValidation | AutomaticValidation

export interface ZenodoArtifact {
  id: string
  title: string
  version: string
  license: string
  views: number
  downloads: number
  citations: number
  url: string
  validation?: ArtifactValidation
}

interface OtherRepository {
  id: string
  url: string
  validation?: ArtifactValidation
}

export interface GitHubArtifact {
  id: string
  name: string
  license: string
  stars: number
  forks: number
  url: string
  validation?: ArtifactValidation
}

export interface FigshareArtifact {
  id: string
  title: string
  license: string
  views: number
  downloads: number
  citations: number
  url: string
  validation?: ArtifactValidation
}
