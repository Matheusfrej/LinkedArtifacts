import { Paper } from "../../../domain/paper/entity";
import { DOI } from "../../../domain/value-objects/DOI";
import { papers } from "../../db/drizzle/schema";

export class DrizzlePaperMapper {
  static toDomain(raw: typeof papers.$inferSelect): Paper {
    return new Paper(
      raw.id,
      raw.title,
      raw.doi ? new DOI(raw.doi) : undefined,
      raw.createdAt
    )
  }
}
