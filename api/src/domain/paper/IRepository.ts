import { Paper } from './entity';

export interface IPaperRepository {
  list(): Promise<Paper[]>;
  listByNames(name: string[]): Promise<Paper[]>;
}
