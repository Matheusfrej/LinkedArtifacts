import { Request, Response } from 'express';
import { DrizzlePaperRepository } from './DrizzleRepository';
import { ListPapers } from '../../../application/use-cases/ListPapers';
import { ListPapersByTitles } from '../../../application/use-cases/ListPapersByTitles';

const repo = new DrizzlePaperRepository();
const listUseCase = new ListPapers(repo);
const listByTitlesUseCase = new ListPapersByTitles(repo);

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

  static async listByTitles(req: Request, res: Response) {
    try {
      const { titles } = req.body;

      if (!titles) {
        return res.status(400).json({
          error: "'titles' is required",
        });
      }

      if (!Array.isArray(titles)) {
        return res.status(400).json({
          error: "'titles' must be an array",
        });
      }

      if (titles.length === 0) {
        return res.status(400).json({
          error: "'titles' cannot be empty",
        });
      }

      const invalid = titles.find(
        (n) => typeof n !== "string" || n.trim().length === 0
      );

      if (invalid !== undefined) {
        return res.status(400).json({
          error: "'titles' must contain only non-empty strings",
        });
      }

      const items = await listByTitlesUseCase.execute({ paperTitles: titles });

      return res.json(items);

    } catch (err) {
      console.error(err);
      return res.status(500).json({
        error: "Internal server error",
      });
    }
  }

}
