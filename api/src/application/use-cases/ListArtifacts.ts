import { IArtifactRepository } from '../../domain/repositories/IArtifactRepository';


export class ListArtifacts {
  constructor(private repo: IArtifactRepository) {}

  async execute() {
    return await this.repo.list();
  }
}
