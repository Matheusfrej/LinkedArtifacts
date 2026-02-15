import { Request, Response } from 'express';
import { DrizzleArtifactRepository } from './DrizzleRepository';
import { ListArtifacts } from '../../../application/use-cases/ListArtifacts';

const repo = new DrizzleArtifactRepository();
const listUseCase = new ListArtifacts(repo);

export class ArtifactController {
  static async list(req: Request, res: Response) {
    try {
      const items = await listUseCase.execute();
      return res.json(items);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}
