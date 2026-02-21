import { IPaperRepository } from '../../../domain/paper/IRepository';
import { ICacheService } from '../../services/ICacheService';

type Paper = {
  id: number,
  title: string,
  doi: string | null,
  hasArtifact: boolean
}

type ListPapersOutputDTO = Paper[]

export class ListPapers {
  constructor(
    private repo: IPaperRepository, 
    private cache: ICacheService
  ) {}

  async execute(): Promise<ListPapersOutputDTO> {
    const cacheKey = ListPapers.name;

    const cached = await this.cache.get<ListPapersOutputDTO>(cacheKey);
    if (cached) return cached;

    const papers = (await this.repo.list()).map(p => ({
      id: p.id,
      title: p.getTitle(),
      doi: p.getDOI()?.value ?? null,
      hasArtifact: p.getArtifacts() ? true : false
    }))

    const oneHourInSeconds = 3600
    await this.cache.set(cacheKey, papers, oneHourInSeconds);

    return papers;
  }
}
