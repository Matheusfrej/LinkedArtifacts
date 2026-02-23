import { NextFunction, Request, Response } from 'express';
import { BaseExpressController } from '../BaseExpressController';
import { ArtifactUseCaseFactory } from '../../../application/factories/use-cases/ArtifactUseCaseFactory';
import z from 'zod';

export class ArtifactController extends BaseExpressController<ArtifactUseCaseFactory> {
  constructor(useCaseFactory: ArtifactUseCaseFactory) {
    super(useCaseFactory);
    this.defineRoutes();
  }

  defineRoutes(): void {
    this.router.get('/', this.list);
  }
  private list = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const schema = z.object({
          paperId: z.coerce.number({
            error: "'paperId' must be a number."
          }).optional()
        })

        const { paperId } = schema.parse(req.query)
        
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
