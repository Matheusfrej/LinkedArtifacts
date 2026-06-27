import { Request, Response, NextFunction } from "express";
import z from "zod"

export const validate =
  (schema: z.ZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse({
        body: req.body ?? {},
        params: req.params ?? {},
        query: req.query ?? {},
      });

      req.validatedPayload = validated
      next()
    } catch (err) {
      next(err)
    }
  }