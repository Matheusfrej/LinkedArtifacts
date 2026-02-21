import { NextFunction, Request, Response } from 'express';
import { DrizzlePaperRepository } from './DrizzleRepository';
import { ListPapers } from '../../../application/use-cases/paper/ListPapers';
import { ListPapersByTitles } from '../../../application/use-cases/paper/ListPapersByTitles';
import { FindPaperById } from '../../../application/use-cases/paper/FindPaperById';
import { DrizzlePaperQueryService } from './DrizzleQuery';
import z from 'zod';
import { RedisCacheService } from '../../redis/RedisCacheService';

const repo = new DrizzlePaperRepository();
const queryService = new DrizzlePaperQueryService();
const cacheService = new RedisCacheService();
const findByIdUseCase = new FindPaperById(repo);
const listUseCase = new ListPapers(repo, cacheService);
const listByTitlesUseCase = new ListPapersByTitles(queryService);

export class PaperController {
  static async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        id: z.coerce.number({
          error: "'id' must be a number."
        })
      })
      
      const { id } = schema.parse(req.params)

      const item = await findByIdUseCase.execute({ id })
      return res.json(item)
    } catch (err) {
      next(err);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const items = await listUseCase.execute();
      return res.json(items);
    } catch (err) {
      next(err);
    }
  }

  static async listByTitles(req: Request, res: Response, next: NextFunction) {
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

      const items = await listByTitlesUseCase.execute({
        paperTitles: titles,
      });

      return res.json(items);

    } catch (err) {
      next(err);
    }
  }

}
