import { Paper } from './entity';

export interface IPaperRepository {
  list(): Promise<Paper[]>;
  listByTitles(name: string[]): Promise<Paper[]>;
}
