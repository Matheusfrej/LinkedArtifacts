import { Artifact } from '../entities/Artifact';

export interface IArtifactRepository {
  list(): Promise<Artifact[]>;
}
