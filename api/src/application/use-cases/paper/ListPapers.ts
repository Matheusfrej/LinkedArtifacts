import { BadgeName } from '../../../domain/enums/BadgeName';
import { IPaperRepository } from '../../../domain/paper/IRepository';
import { ICacheService } from '../../services/ICacheService';
import { UseCase } from '../UseCase';

type Paper = {
  id: number,
  title: string,
  venue: string,
  year: number,
  authors: string,
  pageCount: number,
  doi: string | null,
  hasArtifact: boolean,
  badges: {
    id: number,
    name: BadgeName
  }[]
}

export type ListPapersOutputDTO = Paper[]

export class ListPapers implements UseCase<void, ListPapersOutputDTO> {
  constructor(
    private repo: IPaperRepository, 
    private cache: ICacheService
  ) {}

  async execute(): Promise<ListPapersOutputDTO> {
    const papers = (await this.repo.list()).map(p => {
      const artifacts = p.getArtifacts()
      const badges = p.getBadges() ?? []

      let hasArtifact = false
      if (artifacts && artifacts.length > 0) hasArtifact = true
      return {
        id: p.id,
        title: p.getTitle(),
        venue: p.getVenue(),
        year: p.getYear(),
        authors: p.getAuthors(),
        pageCount: p.getPageCount(),
        doi: p.getDOI()?.value ?? null,
        hasArtifact,
        badges: badges.map((b) => ({ id: b.id, name: b.getName() }))
      }
    })
    return papers;
  }
}
