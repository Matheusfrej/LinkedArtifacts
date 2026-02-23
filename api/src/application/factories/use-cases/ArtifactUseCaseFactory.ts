import { ListArtifacts, ListArtifactsOutputDTO } from "../../use-cases/artifact/ListArtifacts";
import { ListArtifactsByPaperId, ListArtifactsByPaperIdInputDTO, ListArtifactsByPaperIdOutputDTO } from "../../use-cases/artifact/ListArtifactsByPaperId";
import { UseCase } from "../../use-cases/UseCase";
import { UseCaseFactory } from "./UseCaseFactory";

export class ArtifactUseCaseFactory extends UseCaseFactory {
  private readonly artifactRepo = this.repoFactory.makeArtifactRepository()

  makeListArtifacts(): UseCase<void, ListArtifactsOutputDTO> {
    return new ListArtifacts(this.artifactRepo)
  }
  makeListArtifactsByPaperId(): UseCase<ListArtifactsByPaperIdInputDTO, ListArtifactsByPaperIdOutputDTO> {
    return new ListArtifactsByPaperId(this.artifactRepo)
  }
}