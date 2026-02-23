import { CachedUseCase } from "../../use-cases/CachedUseCase";
import { FindPaperById, FindPaperByIdInputDTO, FindPaperByIdOutputDTO } from "../../use-cases/paper/FindPaperById";
import { ListPapers, ListPapersOutputDTO } from "../../use-cases/paper/ListPapers";
import { ListPapersByTitles, ListPapersByTitlesInputDTO, ListPapersByTitlesOutputDTO } from "../../use-cases/paper/ListPapersByTitles";
import { UseCase } from "../../use-cases/UseCase";
import { UseCaseFactory } from "./UseCaseFactory";

export class PaperUseCaseFactory extends UseCaseFactory {
  private readonly paperRepo = this.repoFactory.makePaperRepository()
  private readonly cache = this.cacheFactory.makeCacheService()
  private readonly paperQuery = this.queryFactory.makePaperQueryService()

  makeListPapers(): UseCase<void, ListPapersOutputDTO> {
    const useCase = new ListPapers(this.paperRepo, this.cache)
    const CACHE_TTL_ONE_HOUR  = 3600

    const cachedUseCase = new CachedUseCase(
      useCase,
      this.cache,
      {
        key: (input) => "papers:list:v1",
        ttl: CACHE_TTL_ONE_HOUR
      }
    )

    return cachedUseCase
  }
  makeListPapersByTitles(): UseCase<ListPapersByTitlesInputDTO, ListPapersByTitlesOutputDTO> {
    return new ListPapersByTitles(this.paperQuery)
  }
  makeFindPaperById(): UseCase<FindPaperByIdInputDTO, FindPaperByIdOutputDTO> {
    return new FindPaperById(this.paperRepo)
  }
}