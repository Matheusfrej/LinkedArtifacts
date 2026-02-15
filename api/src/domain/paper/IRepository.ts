import { Paper } from './entity';

export interface IPaperRepository {
  list(): Promise<Paper[]>;
}
