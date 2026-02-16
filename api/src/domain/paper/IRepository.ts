import { Paper } from './entity';

export interface IPaperRepository {
  findById(id: number): Promise<Paper>;
  list(): Promise<Paper[]>;
  listByTitles(name: string[]): Promise<Paper[]>;
}
