import { Request, Response } from 'express';
import { DrizzleArtifactRepository } from './DrizzleRepository';
import { ListArtifacts } from '../../../application/use-cases/ListArtifacts';
import { ListArtifactsByPaperId } from '../../../application/use-cases/ListArtifactsByPaperId';
import { Artifact } from '../../../domain/artifact/entity';

const repo = new DrizzleArtifactRepository();
const listUseCase = new ListArtifacts(repo);
const findByPaperIdUseCase = new ListArtifactsByPaperId(repo);

export class ArtifactController {
  static async list(req: Request, res: Response) {
    try {
      const { paperId } = req.query;
      let items: Artifact[] = [];
      if (paperId) {
        if (paperId !== undefined && isNaN(Number(paperId))) {
          return res.status(400).json({ error: 'paperId must be a number' });
        }

        items = await findByPaperIdUseCase.execute({ paperId: +paperId });
      } else {
        items = await listUseCase.execute();
      }

      return res.json(items);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}
