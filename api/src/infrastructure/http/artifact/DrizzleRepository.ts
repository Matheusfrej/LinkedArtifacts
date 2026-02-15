import { db } from '../../db/drizzle';
import { artifacts } from '../../db/schema';
import { IArtifactRepository } from '../../../domain/artifact/IRepository';
import { Artifact } from '../../../domain/artifact/entity';

export class DrizzleArtifactRepository implements IArtifactRepository {
  async list(): Promise<Artifact[]> {
    const rows = await db.select().from(artifacts);
    return rows.map((r: any) => ({ id: r.id, name: r.name, url: r.url, paperId: r.paperId, createdAt: r.createdAt }));
  }
}
