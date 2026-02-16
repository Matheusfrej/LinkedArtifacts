import { Paper } from '../../../domain/paper/entity';
import { IPaperRepository } from '../../../domain/paper/IRepository';
import { ValidationError } from '../../errors/ApplicationError';

type Input = {
  paperTitles: string[]
}

type OutReg = {
  id: number
  title: string
  artifacts: {
    id: number,
    name: string;
    url: string;
  }[]
}

type Output = OutReg[]

export class ListPapersByTitles {
  constructor(private repo: IPaperRepository) {}

  async execute({ paperTitles } : Input): Promise<Output> {

    if (paperTitles.length > 50) {
      throw new ValidationError("maximum number of 'titles' is 50.")
    }

    const sanitizedTitles = paperTitles.map(t => t.trim().toLowerCase())
    const rows = await this.repo.listByTitles(sanitizedTitles);

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

    const papers = Array.from(grouped.values());

    return papers.map((paper) => ({ 
      id: paper.id, 
      title: paper.title, 
      artifacts: paper.artifacts 
        ? paper.artifacts.map((artifact) => ({
          id: artifact.id,
          name: artifact.name ?? '',
          url: artifact.url
        })) 
        : []
    }))
  }
}
