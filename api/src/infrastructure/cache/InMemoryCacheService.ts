import { ICacheService } from "../../application/services/ICacheService";

type CacheEntry = {
  value: unknown;
  expiresAt: number | null;
};

export class InMemoryCacheService implements ICacheService {
  private cache = new Map<string, CacheEntry>();

  private isExpired(entry: CacheEntry): boolean {
    return entry.expiresAt !== null && Date.now() > entry.expiresAt;
  }

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);

    if (!entry || this.isExpired(entry)) {
      this.cache.delete(key);
      return null;
    }

    return entry.value as T;
  }

  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;
    this.cache.set(key, { value, expiresAt });
  }

  async del(key: string): Promise<void> {
    this.cache.delete(key);
  }
}
