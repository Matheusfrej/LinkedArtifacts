import { IPaperRepository } from '../../../domain/paper/IRepository';

type FindPaperByIdInputDTO = {
  id: number
}

type FindPaperByIdOutputDTO = {
  id: number,
  title: string,
  doi: string | null,
}

export class FindPaperById {
  constructor(private repo: IPaperRepository) {}

  async execute({ id } : FindPaperByIdInputDTO): Promise<FindPaperByIdOutputDTO> {
    const paper = await this.repo.findById(id)
    return {
      id: paper.id,
      title: paper.getTitle(),
      doi: paper.getDOI()?.value ?? null,
    };
  }
}
