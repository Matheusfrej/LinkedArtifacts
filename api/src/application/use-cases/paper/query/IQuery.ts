export type PaperWithArtifactsDTO = {
  id: number;
  title: string;
  artifacts: {
    id: number;
    name?: string;
    url: string;
  }[];
};

export interface IPaperQuery {
  listByTitles(sanitizedTitles: string[]): Promise<PaperWithArtifactsDTO[]>;
}