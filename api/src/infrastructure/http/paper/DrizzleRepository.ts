import { db } from '../../db/drizzle';
import { eq } from "drizzle-orm";
import { artifacts, papers } from '../../db/drizzle/schema';
import { IPaperRepository } from '../../../domain/paper/IRepository';
import { Paper } from '../../../domain/paper/entity';
import { ResourceNotFoundError } from '../../../application/errors/ApplicationError';
import { DrizzlePaperMapper } from './DrizzleMapper';
import { DrizzleArtifactMapper } from '../artifact/DrizzleMapper';

export class DrizzlePaperRepository implements IPaperRepository {
  async findById(id: number): Promise<Paper> {
    const rows = await db
      .select()
      .from(papers)
      .where(eq(papers.id, id))
      .orderBy(papers.title);

    const paper = rows[0]

    if (!paper) {
      throw new ResourceNotFoundError('Paper', id);
    }

    return DrizzlePaperMapper.toDomain(paper);
  }
  
  async list(): Promise<Paper[]> {
    const rows = await db
      .select()
      .from(papers)
      .leftJoin(artifacts, eq(artifacts.paperId, papers.id))
      .orderBy(papers.title);

    const papersMap = new Map<number, Paper>();

    for (const row of rows) {
      let paper = papersMap.get(row.papers.id);

      if (!paper) {
        paper = DrizzlePaperMapper.toDomain({
          id: row.papers.id,
          title: row.papers.title,
          doi: row.papers.doi,
          createdAt: row.papers.createdAt,
        });

        papersMap.set(row.papers.id, paper);
      }

      if (row.artifacts?.id) {
        const artifact = DrizzleArtifactMapper.toDomain({
          id: row.artifacts.id,
          name: row.artifacts.name,
          url: row.artifacts.url,
          doi: row.artifacts.doi,
          paperId: row.artifacts.paperId,
          createdAt: row.artifacts.createdAt,
        });

        paper.addArtifact(artifact);
      }
    }
    
    return Array.from(papersMap.values());
  }
}
