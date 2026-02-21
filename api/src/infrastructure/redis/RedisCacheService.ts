import { ICacheService } from "../../application/services/ICacheService";
import { redisRequestDuration, redisRequestsTotal } from "../prometheus/config";
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
    const end = redisRequestDuration.startTimer({ command: "get" });
    try {
      const data = await redis.get(key);
      console.log('redis get', this.truncateCachedValue(data));
      
      return data ? JSON.parse(data) : null;
    } catch (error) {
      redisRequestsTotal.inc({ command: "get", status: "error" });
      console.warn("Redis get error, bypassing cache", { key, error });
      return null;
    } finally {
      end();
    }
  }

  async set(key: string, value: unknown, ttl?: number): Promise<void> {
    const end = redisRequestDuration.startTimer({ command: "set" });

    try {
      const stringifiedValue = JSON.stringify(value)
      console.log('redis set', key, this.truncateCachedValue(stringifiedValue));
      await redis.set(key, stringifiedValue, ttl ? { EX: ttl } : {});
    } catch (error) {
      redisRequestsTotal.inc({ command: "set", status: "error" });
      console.warn("Redis set error, bypassing cache", { key, value, error });
    } finally {
      end();
    }
    
  }

  async del(key: string): Promise<void> {
    const end = redisRequestDuration.startTimer({ command: "del" });

    try {
      console.log('redis del', key);
      await redis.del(key);
    } catch (error) {
      redisRequestsTotal.inc({ command: "del", status: "error" });
      console.warn("Redis del error, bypassing cache", { key, error });
    } finally {
      end();
    }
  }
}