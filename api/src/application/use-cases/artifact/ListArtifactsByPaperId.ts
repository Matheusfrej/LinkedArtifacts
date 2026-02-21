import { IArtifactRepository } from '../../../domain/artifact/IRepository';

type ListArtifactsByPaperIdInputDTO = {
  paperId: number
}

type ArtifactByPaperId = {
  id: number,
  name: string | null,
  url: string,
  paperId: number,
  doi: string | null,
}

type ListArtifactsByPaperIdOutputDTO = ArtifactByPaperId[]

export class ListArtifactsByPaperId {
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
