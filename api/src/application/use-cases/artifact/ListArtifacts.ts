import { IArtifactRepository } from '../../../domain/artifact/IRepository';

type Artifact = {
  id: number,
  name?: string,
  url: string,
  paperId: number,
  doi?: string,
  createdAt?: Date,
}

type ListArtifactsOutputDTO = Artifact[]

export class ListArtifacts {
  constructor(private repo: IArtifactRepository) {}

  async execute(): Promise<ListArtifactsOutputDTO> {
    return (await this.repo.list()).map(a => ({
      id: a.id,
      name: a.getName(),
      url: a.getUrl().value,
      paperId: a.getPaperId(),
      doi: a.getDoi()?.value,
      createdAt: a.getCreatedAt()
    }));
  }
}
