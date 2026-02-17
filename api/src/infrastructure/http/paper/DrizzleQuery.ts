import { db } from '../../db/drizzle';
import { eq, inArray, sql } from "drizzle-orm";
import { artifacts, papers } from '../../db/drizzle/schema';
import { IPaperQuery, PaperWithArtifactsDTO } from '../../../application/use-cases/paper/query/IQuery';

export class DrizzlePaperQuery implements IPaperQuery {
  async listByTitles(sanitizedTitles: string[]): Promise<PaperWithArtifactsDTO[]> {
    const rows = await db
      .select()
      .from(papers)
      .innerJoin(artifacts, eq(artifacts.paperId, papers.id))
      .where(inArray(sql`lower(trim(${papers.title}))`, sanitizedTitles));

    const grouped = new Map<number, PaperWithArtifactsDTO>();

    for (const r of rows) {
      const paperId = r.papers.id;
      if (!grouped.has(paperId)) {
        grouped.set(paperId, {
          id: r.papers.id,
          title: r.papers.title,
          artifacts: [],
        });
      }
      grouped.get(paperId)!.artifacts.push({
        id: r.artifacts.id,
        name: r.artifacts.name ?? undefined,
        url: r.artifacts.url,
      });
    }
    return Array.from(grouped.values());
  }
}