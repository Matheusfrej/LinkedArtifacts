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
    const cacheKey = "papers:list:v1";

    const cached = await this.cache.get<ListPapersOutputDTO>(cacheKey);
    if (cached) return cached;

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

    const CACHE_TTL_ONE_HOUR  = 3600
    await this.cache.set(cacheKey, papers, CACHE_TTL_ONE_HOUR);

    return papers;
  }
}
