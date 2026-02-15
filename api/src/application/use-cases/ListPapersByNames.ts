import { IPaperRepository } from '../../domain/paper/IRepository';

type Input = {
  paperNames: string[]
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

export class ListPapersByNames {
  constructor(private repo: IPaperRepository) {}

  async execute({ paperNames } : Input): Promise<Output> {
    const papers = await this.repo.listByNames(paperNames);

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
