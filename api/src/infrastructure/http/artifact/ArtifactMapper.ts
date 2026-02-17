import { Artifact } from "../../../domain/artifact/entity";
import { DOI } from "../../../domain/value-objects/DOI";
import { URL } from "../../../domain/value-objects/URL";
import { artifacts } from "../../db/drizzle/schema";

export class ArtifactMapper {
  static toDomain(raw: typeof artifacts.$inferSelect): Artifact {
    return new Artifact(
      raw.id,
      raw.name ?? undefined,
      new URL(raw.url),
      raw.paperId,
      raw.doi ? new DOI(raw.doi) : undefined,
      raw.createdAt
    )
  }
}
