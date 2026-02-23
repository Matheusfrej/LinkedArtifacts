import { IArtifactRepository } from '../../../domain/artifact/IRepository';
import { UseCase } from '../UseCase';

export type ListArtifactsByPaperIdInputDTO = {
  paperId: number
}

type ArtifactByPaperId = {
  id: number,
  name: string | null,
  url: string,
  paperId: number,
  doi: string | null,
}

export type ListArtifactsByPaperIdOutputDTO = ArtifactByPaperId[]

export class ListArtifactsByPaperId implements UseCase<ListArtifactsByPaperIdInputDTO, ListArtifactsByPaperIdOutputDTO> {
  constructor(private repo: IArtifactRepository) {}

  async execute({paperId} : ListArtifactsByPaperIdInputDTO): Promise<ListArtifactsByPaperIdOutputDTO> {
    return (await this.repo.listByPaperId(paperId)).map(a => ({
      id: a.id,
      name: a.getName() ?? null,
      url: a.getUrl().value,
      paperId: a.getPaperId(),
      doi: a.getDoi()?.value ?? null
    }));
  }
}
