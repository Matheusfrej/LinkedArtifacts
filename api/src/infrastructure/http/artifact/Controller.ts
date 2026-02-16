import { Request, Response } from 'express';
import { DrizzleArtifactRepository } from './DrizzleRepository';
import { ListArtifacts } from '../../../application/use-cases/artifact/ListArtifacts';
import { ListArtifactsByPaperId } from '../../../application/use-cases/artifact/ListArtifactsByPaperId';
import { Artifact } from '../../../domain/artifact/entity';

const repo = new DrizzleArtifactRepository();
const listUseCase = new ListArtifacts(repo);
const findByPaperIdUseCase = new ListArtifactsByPaperId(repo);

export class ArtifactController {
  static async list(req: Request, res: Response, next: Function) {
    try {
      const paperId = req.query?.paperId;
      let items: Artifact[] = [];
      if (paperId) {
        if (paperId !== undefined && isNaN(Number(paperId))) {
          return res.status(400).json({ message: 'paperId must be a number' });
        }

        items = await findByPaperIdUseCase.execute({ paperId: +paperId });
      } else {
        items = await listUseCase.execute();
      }

      return res.json(items);
    } catch (err) {
      next(err);
    }
  }
}
