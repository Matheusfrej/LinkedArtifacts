import { db } from '../../db/drizzle';
import { papers } from '../../db/schema';
import { IPaperRepository } from '../../../domain/paper/IRepository';
import { Paper } from '../../../domain/paper/entity';

export class DrizzlePaperRepository implements IPaperRepository {
  async list(): Promise<Paper[]> {
    const rows = await db.select().from(papers);
    return rows.map((r: any) => ({ id: r.id, title: r.title, doi: r.doi, createdAt: r.createdAt }));
  }
}
