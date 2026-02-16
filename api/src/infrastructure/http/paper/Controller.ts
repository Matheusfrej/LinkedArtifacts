import { Request, Response } from 'express';
import { DrizzlePaperRepository } from './DrizzleRepository';
import { ListPapers } from '../../../application/use-cases/ListPapers';
import { ListPapersByTitles } from '../../../application/use-cases/ListPapersByTitles';
import { FindPaperById } from '../../../application/use-cases/FindPaperById';

const repo = new DrizzlePaperRepository();
const findByIdUseCase = new FindPaperById(repo);
const listUseCase = new ListPapers(repo);
const listByTitlesUseCase = new ListPapersByTitles(repo);

export class PaperController {
  static async findById(req: Request, res: Response) {
    const raw = req.params.id
    const id = Number(raw)

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid paper id' })
    }

    try {
      const item = await findByIdUseCase.execute({ id })
      return res.json(item)
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async list(req: Request, res: Response) {
    try {
      const items = await listUseCase.execute();
      return res.json(items);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async listByTitles(req: Request, res: Response) {
    try {
      const titles = req.body?.titles;

      if (!titles) {
        return res.status(400).json({
          message: "'titles' is required",
        });
      }

      if (!Array.isArray(titles)) {
        return res.status(400).json({
          message: "'titles' must be an array",
        });
      }

      if (titles.length === 0) {
        return res.status(400).json({
          message: "'titles' cannot be empty",
        });
      }

      const invalid = titles.find(
        (n) => typeof n !== "string" || n.trim().length === 0
      );

      if (invalid !== undefined) {
        return res.status(400).json({
          message: "'titles' must contain only non-empty strings",
        });
      }

      const items = await listByTitlesUseCase.execute({ paperTitles: titles });

      return res.json(items);

    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

}
