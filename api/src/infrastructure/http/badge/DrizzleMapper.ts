import { Badge } from "../../../domain/badge/entity";
import { BadgeName } from "../../../domain/enums/BadgeName";
import { badges } from "../../db/drizzle/schema";

export class DrizzleBadgeMapper {
  static toDomain(raw: typeof badges.$inferSelect): Badge {
    return new Badge(
      raw.id,
      raw.name as BadgeName,
    );
  }
}