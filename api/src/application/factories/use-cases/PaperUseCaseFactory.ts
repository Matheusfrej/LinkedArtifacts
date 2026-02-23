import { CachedUseCase } from "../../use-cases/CachedUseCase";
import { FindPaperById, FindPaperByIdInputDTO, FindPaperByIdOutputDTO } from "../../use-cases/paper/FindPaperById";
import { ListPapers, ListPapersOutputDTO } from "../../use-cases/paper/ListPapers";
import { ListPapersByTitles, ListPapersByTitlesInputDTO, ListPapersByTitlesOutputDTO } from "../../use-cases/paper/ListPapersByTitles";
import { UseCase } from "../../use-cases/UseCase";
import { UseCaseFactory } from "./UseCaseFactory";

export class PaperUseCaseFactory extends UseCaseFactory {  
    makeListPapers(): UseCase<void, ListPapersOutputDTO> {
      const repo = this.repoFactory.makePaperRepository()
      const cache = this.cacheFactory.makeCacheService()
      const useCase = new ListPapers(repo, cache)
      const CACHE_TTL_ONE_HOUR  = 3600

      const cachedUseCase = new CachedUseCase(
        useCase,
        cache,
        {
          key: (input) => "papers:list:v1",
          ttl: CACHE_TTL_ONE_HOUR
        }
      )

      return cachedUseCase
    }
    makeListPapersByTitles(): UseCase<ListPapersByTitlesInputDTO, ListPapersByTitlesOutputDTO> {
      const query = this.queryFactory.makePaperQueryService()
      return new ListPapersByTitles(query)
    }
    makeFindPaperById(): UseCase<FindPaperByIdInputDTO, FindPaperByIdOutputDTO> {
      const repo = this.repoFactory.makePaperRepository()
      return new FindPaperById(repo)
    }
}