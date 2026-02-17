import { db } from '../../db/drizzle';
import { eq } from "drizzle-orm";
import { papers } from '../../db/drizzle/schema';
import { IPaperRepository } from '../../../domain/paper/IRepository';
import { Paper } from '../../../domain/paper/entity';
import { ResourceNotFoundError } from '../../../application/errors/ApplicationError';
import { DrizzlePaperMapper } from './DrizzleMapper';

export class DrizzlePaperRepository implements IPaperRepository {
  async findById(id: number): Promise<Paper> {
    const rows = await db
      .select()
      .from(papers)
      .where(eq(papers.id, id))

    const paper = rows[0]

    if (!paper) {
      throw new ResourceNotFoundError('Paper', id);
    }

    return DrizzlePaperMapper.toDomain(paper);
  }
  
  async list(): Promise<Paper[]> {
    const rows = await db.select({
      id: papers.id, 
      title: papers.title, 
      doi: papers.doi, 
      createdAt: papers.createdAt 
    }).from(papers);
    return rows.map((r) => DrizzlePaperMapper.toDomain(r));
  }
}
