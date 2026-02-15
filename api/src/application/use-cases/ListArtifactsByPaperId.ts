import { IArtifactRepository } from '../../domain/artifact/IRepository';

type Input = {
  paperId: number
}

export class ListArtifactsByPaperId {
  constructor(private repo: IArtifactRepository) {}

  async execute({paperId} : Input) {
    return await this.repo.findByPaperId(paperId);
  }
}
