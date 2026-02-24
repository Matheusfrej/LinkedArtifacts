import { ArtifactUseCaseFactory } from "../application/factories/use-cases/ArtifactUseCaseFactory";
import { PaperUseCaseFactory } from "../application/factories/use-cases/PaperUseCaseFactory";
import { DrizzleQueryServiceFactory } from "./factories/DrizzleQueryServiceFactory";
import { DrizzleRepositoryFactory } from "./factories/DrizzleRepositoryFactory";
import { RedisCacheServiceFactory } from "./factories/RedisCacheServiceFactory";
import { ExpressApiServer } from "./http/ExpressApiServer";

export async function bootstrap() {
  const drizzleRepoFactory = new DrizzleRepositoryFactory()
  const drizzleQueryFactory = new DrizzleQueryServiceFactory()
  const redisCacheFactory = new RedisCacheServiceFactory()
  const artifactUseCaseFactory = new ArtifactUseCaseFactory(drizzleRepoFactory)
  const paperUseCaseFactory = new PaperUseCaseFactory(drizzleRepoFactory, redisCacheFactory, drizzleQueryFactory)
  const server = new ExpressApiServer(artifactUseCaseFactory, paperUseCaseFactory)
  await server.start();
}