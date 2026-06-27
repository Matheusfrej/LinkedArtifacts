import { CacheServiceFactory } from "../../application/factories/CacheServiceFactory";
import { ICacheService } from "../../application/services/ICacheService";
import { InMemoryCacheService } from "../cache/InMemoryCacheService";

export class InMemoryCacheServiceFactory implements CacheServiceFactory {
  makeCacheService(): ICacheService {
    return new InMemoryCacheService();
  }
}
