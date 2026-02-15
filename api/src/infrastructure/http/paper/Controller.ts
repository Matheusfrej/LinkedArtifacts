import { Request, Response } from 'express';
import { DrizzlePaperRepository } from './DrizzleRepository';
import { ListPapers } from '../../../application/use-cases/ListPapers';

const repo = new DrizzlePaperRepository();
const listUseCase = new ListPapers(repo);

export class PaperController {
  static async list(req: Request, res: Response) {
    try {
      const items = await listUseCase.execute();
      return res.json(items);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}
