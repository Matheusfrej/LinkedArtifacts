import { ValidationError } from '../../errors/ApplicationError';
import { IPaperQuery, PaperWithArtifactsDTO } from './query/IQuery';

type ListPapersByTitlesInputDTO = {
  paperTitles: string[]
}

type ListPapersByTitlesOutputDTO = PaperWithArtifactsDTO[]

export class ListPapersByTitles {
  constructor(private query: IPaperQuery) {}

  async execute({ paperTitles } : ListPapersByTitlesInputDTO): Promise<ListPapersByTitlesOutputDTO> {

    if (paperTitles.length > 50) {
      throw new ValidationError("maximum number of 'titles' is 50.")
    }

    const sanitizedTitles = paperTitles.map(t => t.trim().toLowerCase())
    return await this.query.listByTitles(sanitizedTitles);
  }
}
