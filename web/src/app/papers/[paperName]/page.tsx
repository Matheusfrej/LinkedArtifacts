import ZenodoTable, { type ZenodoArtifact } from './components/ZenodoTable'
import GitHubTable, { type GitHubArtifact } from './components/GitHubTable'
import FigshareTable, {
  type FigshareArtifact,
} from './components/FigshareTable'
import OtherRepositoriesTable, {
  type OtherRepository,
} from './components/OtherRepositoriesTable'

interface PageProps {
  params: Promise<{ paperName: string }>
}

export default async function Page({ params }: PageProps) {
  const { paperName } = await params
  const decodedPaperName = decodeURIComponent(paperName)

  const mockZenodoArtifacts: ZenodoArtifact[] = [
    {
      id: '1',
      title: 'Dataset for corner.py analysis',
      version: 'v1.2.0',
      license: 'MIT',
      views: 1250,
      downloads: 340,
      citations: 15,
      url: 'https://zenodo.org/record/123456',
    },
    {
      id: '2',
      title: 'Supplementary materials',
      version: 'v1.0.0',
      license: 'CC BY 4.0',
      views: 890,
      downloads: 156,
      citations: 8,
      url: 'https://zenodo.org/record/789012',
    },
  ]

  const mockGitHubArtifacts: GitHubArtifact[] = [
    {
      id: '1',
      name: 'corner-py/corner.py',
      license: 'BSD-2-Clause',
      stars: 2340,
      forks: 456,
      url: 'https://github.com/corner-py/corner.py',
    },
    {
      id: '2',
      name: 'corner-py/examples',
      license: 'MIT',
      stars: 89,
      forks: 23,
      url: 'https://github.com/corner-py/examples',
    },
  ]

  const mockFigshareArtifacts: FigshareArtifact[] = [
    {
      id: '1',
      title: 'Corner plot visualization examples',
      license: 'CC BY 4.0',
      views: 567,
      downloads: 123,
      citations: 4,
      url: 'https://figshare.com/articles/123456',
    },
  ]

  const mockOtherRepositories: OtherRepository[] = [
    {
      id: '1',
      url: 'https://arxiv.org/abs/2301.12345',
    },
    {
      id: '2',
      url: 'https://researchgate.net/publication/123456789',
    },
    {
      id: '3',
      url: 'https://repository.university.edu/handle/123456789',
    },
  ]

  return (
    <div className="py-8 space-y-8 max-w-6xl mx-auto px-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          {decodedPaperName}
        </h1>
        <h2 className="text-xl text-foreground/70">Artifacts</h2>
      </div>

      <ZenodoTable data={mockZenodoArtifacts} />
      <GitHubTable data={mockGitHubArtifacts} />
      <FigshareTable data={mockFigshareArtifacts} />
      <OtherRepositoriesTable data={mockOtherRepositories} />

      {mockZenodoArtifacts.length === 0 &&
        mockGitHubArtifacts.length === 0 &&
        mockFigshareArtifacts.length === 0 &&
        mockOtherRepositories.length === 0 && (
          <div className="bg-background border border-foreground/20 rounded-lg shadow-sm">
            <div className="py-12 text-center">
              <p className="text-foreground/60">
                No artifacts found for this paper.
              </p>
            </div>
          </div>
        )}
    </div>
  )
}
