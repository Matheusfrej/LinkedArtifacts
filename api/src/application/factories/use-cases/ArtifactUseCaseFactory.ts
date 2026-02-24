import { IArtifactRepository } from "../../../domain/artifact/IRepository";
import { ListArtifacts, ListArtifactsOutputDTO } from "../../use-cases/artifact/ListArtifacts";
import { ListArtifactsByPaperId, ListArtifactsByPaperIdInputDTO, ListArtifactsByPaperIdOutputDTO } from "../../use-cases/artifact/ListArtifactsByPaperId";
import { UseCase } from "../../use-cases/UseCase";
import { RepositoryFactory } from "../RepositoryFactory";
import { UseCaseFactory } from "./UseCaseFactory";

export class ArtifactUseCaseFactory implements UseCaseFactory {
  private artifactRepo: IArtifactRepository

  constructor (repoFactory: RepositoryFactory) {
    this.artifactRepo = repoFactory.makeArtifactRepository()
  }

  makeListArtifacts(): UseCase<void, ListArtifactsOutputDTO> {
    return new ListArtifacts(this.artifactRepo)
  }
  makeListArtifactsByPaperId(): UseCase<ListArtifactsByPaperIdInputDTO, ListArtifactsByPaperIdOutputDTO> {
    return new ListArtifactsByPaperId(this.artifactRepo)
  }
}