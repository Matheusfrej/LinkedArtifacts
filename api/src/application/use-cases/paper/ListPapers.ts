import { IPaperRepository } from '../../../domain/paper/IRepository';

type Paper = {
  id: number,
  title: string,
  doi?: string,
  createdAt?: Date,
}

type ListPapersOutputDTO = Paper[]

export class ListPapers {
  constructor(private repo: IPaperRepository) {}

  async execute(): Promise<ListPapersOutputDTO> {
    return (await this.repo.list()).map(p => ({
      id: p.id,
      title: p.getTitle(),
      doi: p.getDOI()?.value,
      createdAt: p.getCreatedAt()
    }));
  }
}
