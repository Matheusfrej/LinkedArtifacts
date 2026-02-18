import { NextFunction, Request, Response } from 'express';
import { httpRequestDuration } from '../../prometheus/config';

export const requestDurationMetric = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const end = httpRequestDuration.startTimer();
  res.on("finish", () => {
    end({ method: req.method, route: req.path, status_code: res.statusCode });
  });
  next();
}