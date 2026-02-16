export class ApplicationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, ApplicationError.prototype);
  }
}

export class ResourceNotFoundError extends ApplicationError {
  constructor(resource: string, id: number) {
    super(`${resource} with id ${id} not found`);
    Object.setPrototypeOf(this, ResourceNotFoundError.prototype);
  }
}

export class ValidationError extends ApplicationError {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
