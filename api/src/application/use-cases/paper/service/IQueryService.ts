export type PaperWithArtifactsDTO = {
  id: number;
  title: string;
  artifacts: {
    id: number;
    name: string | null;
    url: string;
  }[];
};

export interface IPaperQueryService {
  listByTitles(sanitizedTitles: string[]): Promise<PaperWithArtifactsDTO[]>;
}