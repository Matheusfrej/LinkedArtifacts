import { ICacheService } from "../../application/services/ICacheService";
import { redis } from "./config";

export class RedisCacheService implements ICacheService {
  truncateCachedValue(value: string | null): string | null {
    return value 
      ? value.length <= 200
        ? value
        : value.substring(0, 100) +
          '\n ... \n' +
          value.substring(value.length - 100)
      : null;
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await redis.get(key);
    console.log('redis get', this.truncateCachedValue(data));
    
    return data ? JSON.parse(data) : null;
  }

  async set(key: string, value: unknown, ttl?: number): Promise<void> {
    const stringifiedValue = JSON.stringify(value)
    console.log('redis set', key, this.truncateCachedValue(stringifiedValue));
    await redis.set(key, stringifiedValue, ttl ? { EX: ttl } : {});
  }

  async del(key: string): Promise<void> {
    console.log('redis del', key);
    await redis.del(key);
  }
}