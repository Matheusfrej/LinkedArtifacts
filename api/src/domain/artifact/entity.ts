import { DomainValidationError } from "../errors/DomainError"
import { DOI } from "../value-objects/DOI"
import { URL } from "../value-objects/URL"

export class Artifact {
  public readonly id: number
  private name: string | undefined
  private url: URL
  private readonly paperId: number
  private readonly doi?: DOI
  private readonly createdAt?: Date

  constructor(
    id: number,
    name: string | undefined,
    url: URL,
    paperId: number,
    doi?: DOI,
    createdAt?: Date,
  ) {
    this.id = id
    this.name = name
    this.url = url
    this.paperId = paperId
    this.doi = doi
    this.createdAt = createdAt ?? new Date()

    this.validate()
  }

  private validate() {
    if (!this.url) throw new DomainValidationError("Artifact must have a URL")
    if (!this.paperId) throw new DomainValidationError("Artifact must belong to a Paper")
  }

  getName(): string | undefined {
    return this.name
  }

  getUrl(): URL {
    return this.url
  }

  getDoi(): DOI | undefined {
    return this.doi
  }

  getPaperId(): number {
    return this.paperId
  }

  getCreatedAt(): Date | undefined {
    return this.createdAt
  }

  rename(newName: string) {
    if (!newName.trim()) {
      throw new DomainValidationError("Artifact name cannot be empty")
    }

    this.name = newName
  }
}
