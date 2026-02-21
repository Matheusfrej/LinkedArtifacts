export type PaperWithArtifactsDTO = {
  id: number;
  title: string;
  artifacts: {
    id: number;
    name: string | null;
    url: string;
  }[];
};

export interface IPaperQuery {
  listByTitles(sanitizedTitles: string[]): Promise<PaperWithArtifactsDTO[]>;
}