import { DomainValidationError } from "../errors/DomainError"

export class URL {
  constructor(public readonly value: string) {
    try {
      new globalThis.URL(value)
    } catch {
      throw new DomainValidationError("Invalid URL")
    }
  }
}
