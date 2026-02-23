import { IPaperRepository } from '../../../domain/paper/IRepository';
import { ICacheService } from '../../services/ICacheService';
import { UseCase } from '../UseCase';

type Paper = {
  id: number,
  title: string,
  doi: string | null,
  hasArtifact: boolean
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

      let hasArtifact = false
      if (artifacts && artifacts.length > 0) hasArtifact = true
      return {
        id: p.id,
        title: p.getTitle(),
        doi: p.getDOI()?.value ?? null,
        hasArtifact
      }
    })
    return papers;
  }
}
