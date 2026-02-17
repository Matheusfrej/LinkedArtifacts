import { db } from '../../db/drizzle';
import { artifacts } from '../../db/drizzle/schema';
import { IArtifactRepository } from '../../../domain/artifact/IRepository';
import { Artifact } from '../../../domain/artifact/entity';
import { eq } from 'drizzle-orm';
import { ArtifactMapper } from './ArtifactMapper';

export class DrizzleArtifactRepository implements IArtifactRepository {
  async listByPaperId(paperId: number): Promise<Artifact[]> {
    const rows = await db.select({
      id: artifacts.id,
      name: artifacts.name, 
      url: artifacts.url, 
      paperId: artifacts.paperId, 
      doi: artifacts.doi, 
      createdAt: artifacts.createdAt 
  }).from(artifacts).where(eq(artifacts.paperId, paperId));
    return rows.map((r) => ArtifactMapper.toDomain(r));
  }
  async list(): Promise<Artifact[]> {
    const rows = await db.select({
      id: artifacts.id,
      name: artifacts.name, 
      url: artifacts.url, 
      paperId: artifacts.paperId, 
      doi: artifacts.doi, 
      createdAt: artifacts.createdAt 
    }).from(artifacts);
    return rows.map((r) => ArtifactMapper.toDomain(r));
  }
}
