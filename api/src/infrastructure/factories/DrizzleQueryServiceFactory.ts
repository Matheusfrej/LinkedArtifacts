import { QueryServiceFactory } from "../../application/factories/QueryServiceFactory";
import { IPaperQueryService } from "../../application/use-cases/paper/service/IQueryService";
import { DrizzlePaperQueryService } from "../http/paper/DrizzleQuery";

export class DrizzleQueryServiceFactory implements QueryServiceFactory {
  makePaperQueryService(): IPaperQueryService {
    return new DrizzlePaperQueryService()
  }
  
}