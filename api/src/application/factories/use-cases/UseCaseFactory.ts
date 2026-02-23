import { CacheServiceFactory } from "../CacheServiceFactory";
import { QueryServiceFactory } from "../QueryServiceFactory";
import { RepositoryFactory } from "../RepositoryFactory";

export abstract class UseCaseFactory {
  constructor(
      protected readonly repoFactory: RepositoryFactory,
      protected readonly cacheFactory: CacheServiceFactory,
      protected readonly queryFactory: QueryServiceFactory,
    ) {}
}