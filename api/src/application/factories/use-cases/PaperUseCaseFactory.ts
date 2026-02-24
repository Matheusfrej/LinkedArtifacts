import { IPaperRepository } from "../../../domain/paper/IRepository";
import { ICacheService } from "../../services/ICacheService";
import { CachedUseCase } from "../../use-cases/CachedUseCase";
import { FindPaperById, FindPaperByIdInputDTO, FindPaperByIdOutputDTO } from "../../use-cases/paper/FindPaperById";
import { ListPapers, ListPapersOutputDTO } from "../../use-cases/paper/ListPapers";
import { ListPapersByTitles, ListPapersByTitlesInputDTO, ListPapersByTitlesOutputDTO } from "../../use-cases/paper/ListPapersByTitles";
import { IPaperQueryService } from "../../use-cases/paper/service/IQueryService";
import { UseCase } from "../../use-cases/UseCase";
import { CacheServiceFactory } from "../CacheServiceFactory";
import { QueryServiceFactory } from "../QueryServiceFactory";
import { RepositoryFactory } from "../RepositoryFactory";
import { UseCaseFactory } from "./UseCaseFactory";

export class PaperUseCaseFactory implements UseCaseFactory {
  private paperRepo: IPaperRepository
  private cache: ICacheService
  private paperQuery: IPaperQueryService

  constructor (
    repoFactory: RepositoryFactory,
    cacheFactory: CacheServiceFactory,
    queryFactory: QueryServiceFactory,
  ) {
      this.paperRepo = repoFactory.makePaperRepository()
      this.cache = cacheFactory.makeCacheService()
      this.paperQuery = queryFactory.makePaperQueryService()
    }

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