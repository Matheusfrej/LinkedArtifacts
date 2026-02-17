import { Artifact } from './entity';

export interface IArtifactRepository {
  list(): Promise<Artifact[]>;
  listByPaperId(paperId: number): Promise<Artifact[]>;
}
