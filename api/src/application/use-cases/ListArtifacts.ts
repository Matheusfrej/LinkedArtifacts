import { IArtifactRepository } from '../../domain/artifact/IRepository';


export class ListArtifacts {
  constructor(private repo: IArtifactRepository) {}

  async execute() {
    return await this.repo.list();
  }
}
