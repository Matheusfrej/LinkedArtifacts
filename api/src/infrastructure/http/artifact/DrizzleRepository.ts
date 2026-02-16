import { db } from '../../db/drizzle';
import { artifacts } from '../../db/drizzle/schema';
import { IArtifactRepository } from '../../../domain/artifact/IRepository';
import { Artifact } from '../../../domain/artifact/entity';
import { eq } from 'drizzle-orm';

export class DrizzleArtifactRepository implements IArtifactRepository {
  async findByPaperId(paperId: number): Promise<Artifact[]> {
    const rows = await db.select({
      id: artifacts.id,
      name: artifacts.name, 
      url: artifacts.url, 
      paperId: artifacts.paperId, 
      doi: artifacts.doi, 
      createdAt: artifacts.createdAt 
  }).from(artifacts).where(eq(artifacts.paperId, paperId));
    return rows.map((r) => ({ 
      id: r.id, 
      name: r.name ?? undefined, 
      url: r.url, 
      paperId: r.paperId, 
      doi: r.doi ?? undefined, 
      createdAt: r.createdAt 
    }));
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
    return rows.map((r) => ({ 
      id: r.id, 
      name: r.name ?? undefined, 
      url: r.url, 
      paperId: r.paperId, 
      doi: r.doi ?? undefined, 
      createdAt: r.createdAt 
    }));
  }
}
