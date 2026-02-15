import { Artifact } from './entity';

export interface IArtifactRepository {
  list(): Promise<Artifact[]>;
  findByPaperId(paperId: number): Promise<Artifact[]>;
}
