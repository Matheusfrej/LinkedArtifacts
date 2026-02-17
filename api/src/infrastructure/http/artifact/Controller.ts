import { Request, Response } from 'express';
import { DrizzleArtifactRepository } from './DrizzleRepository';
import { ListArtifacts } from '../../../application/use-cases/artifact/ListArtifacts';
import { ListArtifactsByPaperId } from '../../../application/use-cases/artifact/ListArtifactsByPaperId';

const repo = new DrizzleArtifactRepository();
const listUseCase = new ListArtifacts(repo);
const listByPaperIdUseCase = new ListArtifactsByPaperId(repo);

export class ArtifactController {
  static async list(req: Request, res: Response, next: Function) {
    try {
      const paperId = req.query?.paperId;
      if (paperId) {
        if (paperId !== undefined && isNaN(Number(paperId))) {
          return res.status(400).json({ message: 'paperId must be a number' });
        }

        return res.json(await listByPaperIdUseCase.execute({ paperId: +paperId }));
      } else {
        return res.json(await listUseCase.execute());
      }
    } catch (err) {
      next(err);
    }
  }
}
