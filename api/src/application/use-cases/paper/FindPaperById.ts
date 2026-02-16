import { Paper } from '../../../domain/paper/entity';
import { IPaperRepository } from '../../../domain/paper/IRepository';

type Input = {
  id: number
}

type Output = Paper

export class FindPaperById {
  constructor(private repo: IPaperRepository) {}

  async execute({ id } : Input): Promise<Output> {
    return await this.repo.findById(id);
  }
}
