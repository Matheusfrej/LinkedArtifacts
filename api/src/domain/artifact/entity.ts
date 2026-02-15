import { Paper } from "../paper/entity";

export interface Artifact {
  id: number;
  name?: string;
  url: string;
  paperId: number;
  paper?: Paper;
  createdAt?: Date;
}
