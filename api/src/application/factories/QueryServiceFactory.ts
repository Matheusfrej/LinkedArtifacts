import { IPaperQueryService } from "../use-cases/paper/service/IQueryService";

export interface QueryServiceFactory {
  makePaperQueryService(): IPaperQueryService
}