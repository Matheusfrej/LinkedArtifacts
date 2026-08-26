export type Badge = {
  id: number
  name: string
}

export type ArtifactItem = {
  id: number
  name: string | null
  url: string
  doi: string | null
}

export type Paper = {
  id: number
  title: string
  venue: string
  year: number
  authors: string
  pageCount: number | null
  doi: string | null
  hasArtifact: boolean
  badges: Badge[]
  artifacts?: ArtifactItem[]
}
