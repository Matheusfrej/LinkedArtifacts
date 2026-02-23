import { IArtifactRepository } from "../../domain/artifact/IRepository";
import { IPaperRepository } from "../../domain/paper/IRepository";

export interface RepositoryFactory {
  makePaperRepository(): IPaperRepository
  makeArtifactRepository(): IArtifactRepository
}