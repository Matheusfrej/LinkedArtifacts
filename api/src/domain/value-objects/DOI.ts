import { DomainValidationError } from "../errors/DomainError"

export class DOI {
  constructor(public readonly value: string) {
    if (!this.isValid(value)) {
      throw new DomainValidationError("Invalid DOI")
    }
  }

  private isValid(doi: string): boolean {
    return doi.startsWith("10.")
  }
}
