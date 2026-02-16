import { IPaperRepository } from '../../../domain/paper/IRepository';
import { Paper } from '../../../domain/paper/entity';

type Output = Paper[]

export class ListPapers {
  constructor(private repo: IPaperRepository) {}

  async execute(): Promise<Output> {
    return await this.repo.list();
  }
}
