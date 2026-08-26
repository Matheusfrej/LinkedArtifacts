import { IPaperRepository } from '../../../domain/paper/IRepository';
import { UseCase } from '../UseCase';

export type FindPaperByIdInputDTO = {
  id: number
}

export type FindPaperByIdOutputDTO = {
  id: number
  title: string
  venue: string
  year: number
  authors: string
  pageCount: number | null
  doi: string | null
  hasArtifact: boolean
  badges: {
    id: number
    name: string
  }[]
  artifacts: {
    id: number
    name: string | null
    url: string
    doi: string | null
  }[]
}

export class FindPaperById implements UseCase<FindPaperByIdInputDTO, FindPaperByIdOutputDTO> {
  constructor(private repo: IPaperRepository) {}

  async execute({ id } : FindPaperByIdInputDTO): Promise<FindPaperByIdOutputDTO> {
    const paper = await this.repo.findById(id)
    const artifacts = paper.getArtifacts() ?? []
    const badges = paper.getBadges() ?? []

    return {
      id: paper.id,
      title: paper.getTitle(),
      venue: paper.getVenue(),
      year: paper.getYear(),
      authors: paper.getAuthors(),
      pageCount: paper.getPageCount(),
      doi: paper.getDOI()?.value ?? null,
      hasArtifact: artifacts.length > 0,
      badges: badges.map((b) => ({ id: b.id, name: b.getName() })),
      artifacts: artifacts.map((a) => ({
        id: a.id,
        name: a.getName() ?? null,
        url: a.getUrl().value,
        doi: a.getDoi()?.value ?? null,
      })),
    };
  }
}


