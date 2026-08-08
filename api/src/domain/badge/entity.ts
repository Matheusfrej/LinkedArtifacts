import { DomainValidationError } from "../errors/DomainError"
import { BadgeName } from "../enums/BadgeName"
export class Badge {
  public readonly id: number
  private readonly name: BadgeName

  constructor(
    id: number,
    name: BadgeName
  ) {
    this.id = id
    this.name = name

    this.validate()
  }
  private validate() {
    if (!this.name) throw new DomainValidationError("Badge must have a name")
  }

  getName(): BadgeName {
    return this.name
  }
}
