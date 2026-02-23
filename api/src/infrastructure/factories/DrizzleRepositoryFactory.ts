import { RepositoryFactory } from "../../application/factories/RepositoryFactory";
import { IArtifactRepository } from "../../domain/artifact/IRepository";
import { IPaperRepository } from "../../domain/paper/IRepository";
import { DrizzleArtifactRepository } from "../http/artifact/DrizzleRepository";
import { DrizzlePaperRepository } from "../http/paper/DrizzleRepository";

export class DrizzleRepositoryFactory implements RepositoryFactory {
  makePaperRepository(): IPaperRepository {
    return new DrizzlePaperRepository()
  }
  makeArtifactRepository(): IArtifactRepository {
    return new DrizzleArtifactRepository()
  }
}