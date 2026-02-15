import { Artifact } from "../artifact/entity";

export interface Paper {
  id: number;
  title: string;
  doi?: string;
  artifacts?: Artifact[];
  createdAt?: Date;
}
