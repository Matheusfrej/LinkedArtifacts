import { db } from '../../db/drizzle';
import { eq, inArray, sql } from "drizzle-orm";
import { artifacts, badges, paperBadges, papers } from '../../db/drizzle/schema';
import { IPaperQueryService, PaperWithArtifactsDTO } from '../../../application/use-cases/paper/service/IQueryService';

export class DrizzlePaperQueryService implements IPaperQueryService {
  async listByTitles(sanitizedTitles: string[]): Promise<PaperWithArtifactsDTO[]> {
    const rows = await db
      .select()
      .from(papers)
      .leftJoin(artifacts, eq(artifacts.paperId, papers.id))
      .leftJoin(paperBadges, eq(paperBadges.paperId, papers.id))
      .leftJoin(badges, eq(badges.id, paperBadges.badgeId))
      .where(inArray(sql`lower(trim(${papers.title}))`, sanitizedTitles));

    const grouped = new Map<number, PaperWithArtifactsDTO>();
    const artifactIds = new Map<number, Set<number>>();
    const badgeIds = new Map<number, Set<number>>();

    for (const row of rows) {
      const paperId = row.papers.id;

      if (!grouped.has(paperId)) {
        grouped.set(paperId, {
          id: row.papers.id,
          title: row.papers.title,
          artifacts: [],
          badges: [],
        });
        artifactIds.set(paperId, new Set());
        badgeIds.set(paperId, new Set());
      }

      const paper = grouped.get(paperId)!;
      const paperArtifactIds = artifactIds.get(paperId)!;
      const paperBadgeIds = badgeIds.get(paperId)!;

      if (row.artifacts?.id && !paperArtifactIds.has(row.artifacts.id)) {
        paperArtifactIds.add(row.artifacts.id);
        paper.artifacts.push({
          id: row.artifacts.id,
          name: row.artifacts.name,
          url: row.artifacts.url,
        });
      }

      if (row.badges?.id && !paperBadgeIds.has(row.badges.id)) {
        paperBadgeIds.add(row.badges.id);
        paper.badges.push({
          id: row.badges.id,
          name: row.badges.name,
        });
      }
    }

    return Array.from(grouped.values());
  }
}