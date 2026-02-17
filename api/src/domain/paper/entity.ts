import { DomainValidationError } from "../errors/DomainError";
import { DOI } from "../value-objects/DOI";

export class Paper {
  public readonly id: number
  private readonly title: string
  private readonly doi?: DOI
  private readonly createdAt?: Date

  constructor(
      id: number,
      title: string,
      doi?: DOI,
      createdAt?: Date,
    ) {
      this.id = id
      this.title = title
      this.doi = doi
      this.createdAt = createdAt ?? new Date()
  
      this.validate()
  }

  private validate() {
    if (!this.title) throw new DomainValidationError("Paper must have a title")
  }

  getTitle(): string {
    return this.title
  }

  getDOI(): DOI | undefined {
    return this.doi
  }

  getCreatedAt(): Date | undefined {
    return this.createdAt
  }
}
