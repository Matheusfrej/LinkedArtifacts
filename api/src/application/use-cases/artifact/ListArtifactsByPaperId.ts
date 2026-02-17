import { IArtifactRepository } from '../../../domain/artifact/IRepository';

type ListArtifactsByPaperIdInputDTO = {
  paperId: number
}

type ArtifactByPaperId = {
  id: number,
  name?: string,
  url: string,
  paperId: number,
  doi?: string,
  createdAt?: Date,
}

type ListArtifactsByPaperIdOutputDTO = ArtifactByPaperId[]

export class ListArtifactsByPaperId {
  constructor(private repo: IArtifactRepository) {}

  async execute({paperId} : ListArtifactsByPaperIdInputDTO): Promise<ListArtifactsByPaperIdOutputDTO> {
    return (await this.repo.listByPaperId(paperId)).map(a => ({
      id: a.id,
      name: a.getName(),
      url: a.getUrl().value,
      paperId: a.getPaperId(),
      doi: a.getDoi()?.value,
      createdAt: a.getCreatedAt()
    }));
  }
}
