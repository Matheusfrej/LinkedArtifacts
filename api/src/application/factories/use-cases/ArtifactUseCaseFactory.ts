import { IArtifactRepository } from "../../../domain/artifact/IRepository";
import { IPaperRepository } from "../../../domain/paper/IRepository";
import { ListArtifacts, ListArtifactsOutputDTO } from "../../use-cases/artifact/ListArtifacts";
import { ListArtifactsByPaperId, ListArtifactsByPaperIdInputDTO, ListArtifactsByPaperIdOutputDTO } from "../../use-cases/artifact/ListArtifactsByPaperId";
import { UseCase } from "../../use-cases/UseCase";
import { RepositoryFactory } from "../RepositoryFactory";
import { UseCaseFactory } from "./UseCaseFactory";

export class ArtifactUseCaseFactory implements UseCaseFactory {
  private artifactRepo: IArtifactRepository
  private paperRepo: IPaperRepository

  constructor (repoFactory: RepositoryFactory) {
    this.artifactRepo = repoFactory.makeArtifactRepository()
    this.paperRepo = repoFactory.makePaperRepository()
  }

  makeListArtifacts(): UseCase<void, ListArtifactsOutputDTO> {
    return new ListArtifacts(this.artifactRepo)
  }
  makeListArtifactsByPaperId(): UseCase<ListArtifactsByPaperIdInputDTO, ListArtifactsByPaperIdOutputDTO> {
    return new ListArtifactsByPaperId(this.artifactRepo, this.paperRepo)
  }
}