import { ICacheService } from "../services/ICacheService";

export interface CacheServiceFactory {
  makeCacheService(): ICacheService
}