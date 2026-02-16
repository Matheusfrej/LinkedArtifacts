import { Artifact } from '../../../domain/artifact/entity';
import { IArtifactRepository } from '../../../domain/artifact/IRepository';

type Output = Artifact[]

export class ListArtifacts {
  constructor(private repo: IArtifactRepository) {}

  async execute(): Promise<Output> {
    return await this.repo.list();
  }
}
