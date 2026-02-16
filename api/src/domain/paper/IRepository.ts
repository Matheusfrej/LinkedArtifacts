import { Artifact } from '../artifact/entity';
import { Paper } from './entity';

type ListByTitlesRowType = {
  papers: Paper
  artifacts: Artifact
}

export type ListByTitlesRowsType = ListByTitlesRowType[]

export interface IPaperRepository {
  findById(id: number): Promise<Paper>;
  list(): Promise<Paper[]>;
  listByTitles(sanitizedTitles: string[]): Promise<ListByTitlesRowsType>;
}
