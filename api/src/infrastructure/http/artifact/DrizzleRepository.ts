import { db } from '../../db/drizzle';
import { artifacts } from '../../db/drizzle/schema';
import { IArtifactRepository } from '../../../domain/artifact/IRepository';
import { Artifact } from '../../../domain/artifact/entity';
import { eq } from 'drizzle-orm';
import { DrizzleArtifactMapper } from './DrizzleMapper';

export class DrizzleArtifactRepository implements IArtifactRepository {
  async listByPaperId(paperId: number): Promise<Artifact[]> {
    const rows = await db.select().from(artifacts).where(eq(artifacts.paperId, paperId));
    return rows.map((r) => DrizzleArtifactMapper.toDomain(r));
  }
  async list(): Promise<Artifact[]> {
    const rows = await db.select().from(artifacts);
    return rows.map((r) => DrizzleArtifactMapper.toDomain(r));
  }
}
