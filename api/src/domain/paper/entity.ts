import { Artifact } from "../artifact/entity";
import { Badge } from "../badge/entity";
import { DomainValidationError } from "../errors/DomainError";
import { DOI } from "../value-objects/DOI";

export class Paper {
  public readonly id: number
  private readonly title: string
  private readonly venue: string
  private readonly year: number
  private readonly authors: string
  private readonly pageCount: number
  private readonly doi?: DOI
  private readonly createdAt?: Date
  private artifacts?: Artifact[]
  private badges?: Badge[]

  constructor(
      id: number,
      title: string,
      venue: string,
      year: number,
      authors: string,
      pageCount: number,
      doi?: DOI,
      createdAt?: Date,
      artifacts?: Artifact[],
      badges?: Badge[],
    ) {
      this.id = id
      this.title = title
      this.venue = venue
      this.year = year
      this.authors = authors
      this.pageCount = pageCount
      this.doi = doi
      this.createdAt = createdAt ?? new Date()
      this.artifacts = artifacts
      this.badges = badges
  
      this.validate()
  }

  private validate() {
    if (!this.title) throw new DomainValidationError("Paper must have a title")
  }

  getTitle(): string {
    return this.title
  }

  getVenue(): string {
    return this.venue
  }

  getYear(): number {
    return this.year
  }

  getAuthors(): string {
    return this.authors
  }

  getPageCount(): number {
    return this.pageCount
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

  getBadges(): Badge[] | undefined {
    return this.badges ? [...this.badges] : this.badges
  }

  addArtifact(artifact: Artifact) {
    if (!this.artifacts) {
      this.artifacts = [artifact]
    } else {
      this.artifacts.push(artifact)
    }
  }

  addBadge(badge: Badge) {
    if (!this.badges) {
      this.badges = [badge]
    } else {
      this.badges.push(badge)
    }
  }
}
