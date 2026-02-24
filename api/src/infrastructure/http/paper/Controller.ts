import { NextFunction, Request, Response } from 'express';
import { BaseExpressController } from '../BaseExpressController';
import { PaperUseCaseFactory } from '../../../application/factories/use-cases/PaperUseCaseFactory';
import { validate } from '../middleware/validate';
import { findByIdSchema, FindByIdSchemaType, listByTitlesSchema, ListByTitlesSchemaType } from './schemas';

export class PaperController extends BaseExpressController<PaperUseCaseFactory> {
  constructor(useCaseFactory: PaperUseCaseFactory) {
    super(useCaseFactory);
    this.defineRoutes();
  }

  defineRoutes(): void {
    this.router.get('/', this.list);
    this.router.get('/:id', validate(findByIdSchema),this.findById)
    this.router.post('/by-titles', validate(listByTitlesSchema), this.listByTitles);
  }

  private findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = (req.validatedPayload as FindByIdSchemaType).params

      const item = await this.useCaseFactory.makeFindPaperById().execute({ id })
      return res.json(item)
    } catch (err) {
      next(err);
    }
  }

  private list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const items = await this.useCaseFactory.makeListPapers().execute();
      return res.json(items);
    } catch (err) {
      next(err);
    }
  }

  private listByTitles = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { titles } = (req.validatedPayload as ListByTitlesSchemaType).body

      const items = await this.useCaseFactory.makeListPapersByTitles().execute({
        paperTitles: titles,
      });

      return res.json(items);

    } catch (err) {
      next(err);
    }
  }

}
