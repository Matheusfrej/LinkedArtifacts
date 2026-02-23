import { CacheServiceFactory } from "../../application/factories/CacheServiceFactory";
import { ICacheService } from "../../application/services/ICacheService";
import { RedisCacheService } from "../redis/RedisCacheService";

export class RedisCacheServiceFactory implements CacheServiceFactory {
  makeCacheService(): ICacheService {
    return new RedisCacheService()
  }
  
}