import { ValidationError } from '../../errors/ApplicationError';
import { UseCase } from '../UseCase';
import { IPaperQueryService, PaperWithArtifactsDTO } from './service/IQueryService';

export type ListPapersByTitlesInputDTO = {
  paperTitles: string[]
}

export type ListPapersByTitlesOutputDTO = PaperWithArtifactsDTO[]

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
