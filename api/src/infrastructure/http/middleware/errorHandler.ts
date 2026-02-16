import { Request, Response, NextFunction } from 'express';
import { ApplicationError, ResourceNotFoundError, ValidationError } from '../../../application/errors/ApplicationError';
import { DomainError } from '../../../domain/errors/DomainError';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  // Handle Application Errors
  if (err instanceof ResourceNotFoundError) {
    return res.status(404).json({
      message: err.message,
    });
  }

  if (err instanceof ValidationError) {
    return res.status(400).json({
      message: err.message,
    });
  }

  if (err instanceof ApplicationError) {
    return res.status(400).json({
      message: err.message,
    });
  }

  // Handle Domain Errors
  if (err instanceof DomainError) {
    return res.status(400).json({
      message: err.message,
    });
  }

  // Unknown error
  return res.status(500).json({
    message: 'Internal server error',
  });
};
