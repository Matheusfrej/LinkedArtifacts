import { ArtifactUseCaseFactory } from "../application/factories/use-cases/ArtifactUseCaseFactory";
import { PaperUseCaseFactory } from "../application/factories/use-cases/PaperUseCaseFactory";
import { DrizzleQueryServiceFactory } from "./factories/DrizzleQueryServiceFactory";
import { DrizzleRepositoryFactory } from "./factories/DrizzleRepositoryFactory";
import { InMemoryCacheServiceFactory } from "./factories/InMemoryCacheServiceFactory";
import { RedisCacheServiceFactory } from "./factories/RedisCacheServiceFactory";
import { connectRedis } from "./redis/config";
import { ExpressApiServer } from "./http/ExpressApiServer";

export async function bootstrap() {
  const drizzleRepoFactory = new DrizzleRepositoryFactory()
  const drizzleQueryFactory = new DrizzleQueryServiceFactory()

  const cacheProvider = process.env.CACHE_PROVIDER?.toLowerCase() || "memory";
  const useRedisCache = cacheProvider === "redis";
  const cacheFactory = useRedisCache
    ? new RedisCacheServiceFactory()
    : new InMemoryCacheServiceFactory();

  if (useRedisCache) {
    await connectRedis();
  }

  const artifactUseCaseFactory = new ArtifactUseCaseFactory(drizzleRepoFactory)
  const paperUseCaseFactory = new PaperUseCaseFactory(drizzleRepoFactory, cacheFactory, drizzleQueryFactory)
  const server = new ExpressApiServer(artifactUseCaseFactory, paperUseCaseFactory)
  await server.start();
}