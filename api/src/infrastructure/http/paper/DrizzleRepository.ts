import { db } from '../../db/drizzle';
import { eq, inArray } from "drizzle-orm";
import { artifacts, papers } from '../../db/schema';
import { IPaperRepository } from '../../../domain/paper/IRepository';
import { Paper } from '../../../domain/paper/entity';

export class DrizzlePaperRepository implements IPaperRepository {
  async listByTitles(titles: string[]): Promise<Paper[]> {


    const rows = await db
      .select()
      .from(papers)
      .innerJoin(artifacts, eq(artifacts.paperId, papers.id))
      .where(inArray(papers.title, titles));

    const grouped = new Map<number, Paper>();

    for (const r of rows) {
      const paperId = r.papers.id;

      // Create paper entry if not exists
      if (!grouped.has(paperId)) {
        grouped.set(paperId, {
          id: r.papers.id,
          title: r.papers.title,
          artifacts: [],
        });
      }

      grouped.get(paperId)!.artifacts!.push({
        id: r.artifacts.id,
        name: r.artifacts.name ?? undefined,
        url: r.artifacts.url,
        paperId: paperId
      });
    }

    return Array.from(grouped.values());
  }
  async list(): Promise<Paper[]> {
    const rows = await db.select().from(papers);
    return rows.map((r: any) => ({ id: r.id, title: r.title, doi: r.doi, createdAt: r.createdAt }));
  }
}
