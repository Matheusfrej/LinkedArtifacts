import { Request, Response } from 'express';
import { DrizzlePaperRepository } from './DrizzleRepository';
import { ListPapers } from '../../../application/use-cases/ListPapers';
import { ListPapersByNames } from '../../../application/use-cases/ListPapersByNames';

const repo = new DrizzlePaperRepository();
const listUseCase = new ListPapers(repo);
const listByNamesUseCase = new ListPapersByNames(repo);

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

  static async listByNames(req: Request, res: Response) {
    try {
      const { names } = req.body;

      if (!names) {
        return res.status(400).json({
          error: "'names' is required",
        });
      }

      if (!Array.isArray(names)) {
        return res.status(400).json({
          error: "'names' must be an array",
        });
      }

      if (names.length === 0) {
        return res.status(400).json({
          error: "'names' cannot be empty",
        });
      }

      const invalid = names.find(
        (n) => typeof n !== "string" || n.trim().length === 0
      );

      if (invalid !== undefined) {
        return res.status(400).json({
          error: "'names' must contain only non-empty strings",
        });
      }

      const items = await listByNamesUseCase.execute({ paperNames: names });

      return res.json(items);

    } catch (err) {
      console.error(err);
      return res.status(500).json({
        error: "Internal server error",
      });
    }
  }

}
