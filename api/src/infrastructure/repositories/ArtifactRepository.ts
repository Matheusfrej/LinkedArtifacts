import { db } from '../db/drizzle';
import { artifacts } from '../db/schema';
import { IArtifactRepository } from '../../domain/repositories/IArtifactRepository';
import { Artifact } from '../../domain/entities/Artifact';

export class ArtifactRepository implements IArtifactRepository {
  async list(): Promise<Artifact[]> {
    const rows = await db.select().from(artifacts);
    return rows.map((r: any) => ({ id: r.id, title: r.title, url: r.url, verified: r.verified, createdAt: r.created_at }));
  }
}
