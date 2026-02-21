import { ValidationError } from '../../errors/ApplicationError';
import { UseCase } from '../base';
import { IPaperQueryService, PaperWithArtifactsDTO } from './service/IQueryService';

type ListPapersByTitlesInputDTO = {
  paperTitles: string[]
}

type ListPapersByTitlesOutputDTO = PaperWithArtifactsDTO[]

export class ListPapersByTitles implements UseCase<ListPapersByTitlesInputDTO, ListPapersByTitlesOutputDTO> {
  constructor(private queryService: IPaperQueryService) {}

  async execute({ paperTitles } : ListPapersByTitlesInputDTO): Promise<ListPapersByTitlesOutputDTO> {

    if (paperTitles.length > 50) {
      throw new ValidationError("maximum number of 'titles' is 50.")
    }

    const sanitizedTitles = paperTitles.map(t => t.trim().toLowerCase())
    return await this.queryService.listByTitles(sanitizedTitles);
  }
}
