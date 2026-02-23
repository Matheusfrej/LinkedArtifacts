import { Router } from 'express';
import { UseCaseFactory } from '../../application/factories/use-cases/UseCaseFactory';

export abstract class BaseExpressController<T extends UseCaseFactory> {
  protected readonly router: Router;

  constructor(
    protected readonly useCaseFactory: T,
  ) {
    this.router = Router();
  }

  abstract defineRoutes(): void
  getRouter(): Router {
    return this.router
  }

}