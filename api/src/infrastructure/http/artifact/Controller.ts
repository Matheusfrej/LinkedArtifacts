import { NextFunction, Request, Response } from 'express';
import { BaseExpressController } from '../BaseExpressController';
import { ArtifactUseCaseFactory } from '../../../application/factories/use-cases/ArtifactUseCaseFactory';
import { listSchema, ListSchemaType } from './schemas';
import { validate } from '../middleware/validate';

export class ArtifactController extends BaseExpressController<ArtifactUseCaseFactory> {
  constructor(useCaseFactory: ArtifactUseCaseFactory) {
    super(useCaseFactory);
    this.defineRoutes();
  }

  defineRoutes(): void {
    this.router.get('/', validate(listSchema), this.list);
  }
  private list = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { paperId } = (req.validatedPayload as ListSchemaType).query
        
        if (paperId) {
          const items = await this.useCaseFactory.makeListArtifactsByPaperId().execute({ paperId })
          return res.json(items);
        }
        const items = await this.useCaseFactory.makeListArtifacts().execute()
        return res.json(items);
    } catch (err) {
      next(err);
    }
  }
}
