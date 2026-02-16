import { IPaperRepository } from '../../domain/paper/IRepository';

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
    const papers = await this.repo.listByTitles(paperTitles);

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
