import { NextFunction, Request, Response } from 'express';
import { DrizzleArtifactRepository } from './DrizzleRepository';
import { ListArtifacts } from '../../../application/use-cases/artifact/ListArtifacts';
import { ListArtifactsByPaperId } from '../../../application/use-cases/artifact/ListArtifactsByPaperId';
import z from 'zod';

const repo = new DrizzleArtifactRepository();
const listUseCase = new ListArtifacts(repo);
const listByPaperIdUseCase = new ListArtifactsByPaperId(repo);

export class ArtifactController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
        const schema = z.object({
          paperId: z.coerce.number({
            error: "'paperId' must be a number."
          }).optional()
        })

        const { paperId } = schema.parse(req.query)
        
        if (paperId) {
          const items = await listByPaperIdUseCase.execute({ paperId })
          return res.json(items);
        }
        const items = await listUseCase.execute()
        return res.json(items);
    } catch (err) {
      next(err);
    }
  }
}
