import { IPaperRepository } from '../../domain/paper/IRepository';


export class ListPapers {
  constructor(private repo: IPaperRepository) {}

  async execute() {
    return await this.repo.list();
  }
}
