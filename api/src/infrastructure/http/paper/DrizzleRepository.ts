import { db } from '../../db/drizzle';
import { eq } from "drizzle-orm";
import { artifacts, badges, paperBadges, papers } from '../../db/drizzle/schema';
import { IPaperRepository } from '../../../domain/paper/IRepository';
import { Paper } from '../../../domain/paper/entity';
import { NonUniqueResultError, ResourceNotFoundError } from '../../../application/errors/ApplicationError';
import { DrizzlePaperMapper } from './DrizzleMapper';
import { DrizzleArtifactMapper } from '../artifact/DrizzleMapper';
import { DrizzleBadgeMapper } from '../badge/DrizzleMapper';

type PaperWithArtifactsAndBadgesRow = {
  papers: typeof papers.$inferSelect
  artifacts: typeof artifacts.$inferSelect | null
  paper_badges: typeof paperBadges.$inferSelect | null
  badges: typeof badges.$inferSelect | null
}

export class DrizzlePaperRepository implements IPaperRepository {
  async findById(id: number): Promise<Paper> {
    const rows = await this.fetchPaperRows(eq(papers.id, id));

    if (rows.length === 0) {
      throw new ResourceNotFoundError('Paper', id);
    }

    return this.buildPapers(rows)[0];
  }
  
  async list(): Promise<Paper[]> {
    const rows = await this.fetchPaperRows();
    return this.buildPapers(rows);
  }

  private async fetchPaperRows(condition?: ReturnType<typeof eq>): Promise<PaperWithArtifactsAndBadgesRow[]> {
    const query = db
      .select()
      .from(papers)
      .leftJoin(artifacts, eq(artifacts.paperId, papers.id))
      .leftJoin(paperBadges, eq(paperBadges.paperId, papers.id))
      .leftJoin(badges, eq(badges.id, paperBadges.badgeId));

    if (condition) {
      query.where(condition);
    }

    return await query.orderBy(papers.title);
  }

  private buildPapers(rows: PaperWithArtifactsAndBadgesRow[]): Paper[] {
    const papersMap = new Map<number, Paper>();
    const artifactIds = new Map<number, Set<number>>();
    const badgeIds = new Map<number, Set<number>>();

    for (const row of rows) {
      const paperId = row.papers.id;
      let paper = papersMap.get(paperId);

      if (!paper) {
        paper = DrizzlePaperMapper.toDomain(row.papers);
        papersMap.set(paperId, paper);
        artifactIds.set(paperId, new Set());
        badgeIds.set(paperId, new Set());
      }

      this.addRowRelations(paper, row, artifactIds.get(paperId)!, badgeIds.get(paperId)!);
    }

    return Array.from(papersMap.values());
  }

  private addRowRelations(
    paper: Paper,
    row: PaperWithArtifactsAndBadgesRow,
    artifactIds: Set<number>,
    badgeIds: Set<number>,
  ): void {
    if (row.artifacts?.id && !artifactIds.has(row.artifacts.id)) {
      artifactIds.add(row.artifacts.id);

      const artifact = DrizzleArtifactMapper.toDomain(row.artifacts);

      paper.addArtifact(artifact);
    }

    if (row.badges?.id && !badgeIds.has(row.badges.id)) {
      badgeIds.add(row.badges.id);

      const badge = DrizzleBadgeMapper.toDomain(row.badges);

      paper.addBadge(badge);
    }
  }
}
