import { ListArtifacts, ListArtifactsOutputDTO } from "../../use-cases/artifact/ListArtifacts";
import { ListArtifactsByPaperId, ListArtifactsByPaperIdInputDTO, ListArtifactsByPaperIdOutputDTO } from "../../use-cases/artifact/ListArtifactsByPaperId";
import { UseCase } from "../../use-cases/UseCase";
import { UseCaseFactory } from "./UseCaseFactory";

export class ArtifactUseCaseFactory extends UseCaseFactory {
    makeListArtifacts(): UseCase<void, ListArtifactsOutputDTO> {
      const repo = this.repoFactory.makeArtifactRepository()
      return new ListArtifacts(repo)
    }
    makeListArtifactsByPaperId(): UseCase<ListArtifactsByPaperIdInputDTO, ListArtifactsByPaperIdOutputDTO> {
      const repo = this.repoFactory.makeArtifactRepository()
      return new ListArtifactsByPaperId(repo)
    }
}