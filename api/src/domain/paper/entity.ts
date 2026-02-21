import { Artifact } from "../artifact/entity";
import { DomainValidationError } from "../errors/DomainError";
import { DOI } from "../value-objects/DOI";

export class Paper {
  public readonly id: number
  private readonly title: string
  private readonly doi?: DOI
  private readonly createdAt?: Date
  private artifacts?: Artifact[]

  constructor(
      id: number,
      title: string,
      doi?: DOI,
      createdAt?: Date,
      artifacts?: Artifact[],
    ) {
      this.id = id
      this.title = title
      this.doi = doi
      this.createdAt = createdAt ?? new Date()
      this.artifacts = artifacts
  
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

  getArtifacts(): Artifact[] | undefined {
    return this.artifacts ? [...this.artifacts] : this.artifacts
  }

  addArtifact(artifact: Artifact) {
    if (!this.artifacts) {
      this.artifacts = [artifact]
    } else {
      this.artifacts.push(artifact)
    }
  }
}
