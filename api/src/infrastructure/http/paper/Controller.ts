import { NextFunction, Request, Response } from 'express';
import { BaseExpressController } from '../BaseExpressController';
import { PaperUseCaseFactory } from '../../../application/factories/use-cases/PaperUseCaseFactory';
import z from 'zod';


export class PaperController extends BaseExpressController<PaperUseCaseFactory> {
  constructor(useCaseFactory: PaperUseCaseFactory) {
    super(useCaseFactory);
    this.defineRoutes();
  }

  defineRoutes(): void {
    this.router.get('/', this.list);
    this.router.get('/:id', this.findById)
    this.router.post('/by-titles', this.listByTitles);
  }

  private findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const schema = z.object({
        id: z.coerce.number({
          error: "'id' must be a number."
        })
      })
      
      const { id } = schema.parse(req.params)

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
      const schema = z.object({
        titles: z
          .array(
            z.string().trim().min(1, {
              message: "Titles must be non-empty strings",
            })
          )
          .min(1, {
            message: "'titles' cannot be empty",
          }),
      });

      const { titles } = schema.parse(req.body);

      const items = await this.useCaseFactory.makeListPapersByTitles().execute({
        paperTitles: titles,
      });

      return res.json(items);

    } catch (err) {
      next(err);
    }
  }

}
