import { Artifact } from '../../../domain/artifact/entity';
import { IArtifactRepository } from '../../../domain/artifact/IRepository';

type Input = {
  paperId: number
}

type Output = Artifact[]

export class ListArtifactsByPaperId {
  constructor(private repo: IArtifactRepository) {}

  async execute({paperId} : Input): Promise<Output> {
    return await this.repo.findByPaperId(paperId);
  }
}
