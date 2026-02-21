import { IArtifactRepository } from '../../../domain/artifact/IRepository';
import { UseCase } from '../base';

type Artifact = {
  id: number,
  name: string | null,
  url: string,
  paperId: number,
  doi: string | null,
}

type ListArtifactsOutputDTO = Artifact[]

export class ListArtifacts implements UseCase<void, ListArtifactsOutputDTO> {
  constructor(private repo: IArtifactRepository) {}

  async execute(): Promise<ListArtifactsOutputDTO> {
    return (await this.repo.list()).map(a => ({
      id: a.id,
      name: a.getName() ?? null,
      url: a.getUrl().value,
      paperId: a.getPaperId(),
      doi: a.getDoi()?.value ?? null
    }));
  }
}
