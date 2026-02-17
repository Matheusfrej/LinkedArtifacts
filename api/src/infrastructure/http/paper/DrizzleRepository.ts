import { db } from '../../db/drizzle';
import { eq } from "drizzle-orm";
import { papers } from '../../db/drizzle/schema';
import { IPaperRepository } from '../../../domain/paper/IRepository';
import { Paper } from '../../../domain/paper/entity';
import { ResourceNotFoundError } from '../../../application/errors/ApplicationError';
import { PaperMapper } from './PaperMapper';

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

    return PaperMapper.toDomain(paper);
  }
  
  async list(): Promise<Paper[]> {
    const rows = await db.select({
      id: papers.id, 
      title: papers.title, 
      doi: papers.doi, 
      createdAt: papers.createdAt 
    }).from(papers);
    return rows.map((r) => PaperMapper.toDomain(r));
  }
}
