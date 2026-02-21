import { IPaperRepository } from '../../../domain/paper/IRepository';
import { UseCase } from '../base';

type FindPaperByIdInputDTO = {
  id: number
}

type FindPaperByIdOutputDTO = {
  id: number,
  title: string,
  doi: string | null,
}

export class FindPaperById implements UseCase<FindPaperByIdInputDTO, FindPaperByIdOutputDTO> {
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
