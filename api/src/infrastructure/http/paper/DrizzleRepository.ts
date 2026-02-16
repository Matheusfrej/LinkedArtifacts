import { db } from '../../db/drizzle';
import { eq, inArray, sql } from "drizzle-orm";
import { artifacts, papers } from '../../db/schema';
import { IPaperRepository, ListByTitlesRowsType } from '../../../domain/paper/IRepository';
import { Paper } from '../../../domain/paper/entity';

export class DrizzlePaperRepository implements IPaperRepository {
  async findById(id: number): Promise<Paper> {
    const rows = await db
      .select()
      .from(papers)
      .where(eq(papers.id, id))

    const paper = rows[0]

    return { 
      id: paper.id, 
      title: paper.title, 
      doi: paper.doi ?? undefined, 
      createdAt: paper.createdAt ?? undefined };
  }
  
  async listByTitles(sanitizedTitles: string[]): Promise<ListByTitlesRowsType> {
    const rows = await db
      .select()
      .from(papers)
      .innerJoin(artifacts, eq(artifacts.paperId, papers.id))
      .where(inArray(sql`lower(trim(${papers.title}))`, sanitizedTitles));

    return rows.map((row) => ({
      papers: {
        id: row.papers.id,
        title: row.papers.title,
        doi: row.papers.doi ?? undefined,
        createdAt: row.papers.createdAt ?? undefined
      },
      artifacts: {
        id: row.artifacts.id,
        name: row.artifacts.name ?? undefined,
        url: row.artifacts.url,
        paperId: row.artifacts.paperId
      }
    }));
  }
  async list(): Promise<Paper[]> {
    const rows = await db.select().from(papers);
    return rows.map((r: any) => ({ id: r.id, title: r.title, doi: r.doi, createdAt: r.createdAt }));
  }
}
