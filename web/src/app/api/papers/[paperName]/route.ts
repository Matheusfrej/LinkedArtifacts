import { NextResponse } from 'next/server'
import { ListArtifactsByPaperNameResponse } from '../../../../lib/api/papers/listArtifactsByPaperName'

export async function GET(
  request: Request,
  { params }: { params: { paperName: string } },
) {
  const mockZenodoArtifacts = [
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

  const mockGitHubArtifacts = [
    {
      id: '1',
      name: 'dfm/corner.py',
      license: 'BSD-2-Clause',
      stars: 2340,
      forks: 456,
      url: 'https://github.com/dfm/corner.py',
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

  const mockFigshareArtifacts = [
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

  const mockOtherRepositories = [
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

  const result: ListArtifactsByPaperNameResponse = {
    artifacts: {
      zenodo: mockZenodoArtifacts,
      github: mockGitHubArtifacts,
      figshare: mockFigshareArtifacts,
      other: mockOtherRepositories,
    },
  }

  console.log('result', result)

  return NextResponse.json(result)
}
