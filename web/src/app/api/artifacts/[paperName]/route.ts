import { NextResponse } from 'next/server'
import type { ListByPaperNameResponse } from '@/lib/service/artifacts/listByPaperName'

export async function GET(
  _request: Request,
  _params: { params: { paperName: string } },
) {
  const manualValidation = {
    type: 'manual' as const,
    verifiedBy: 'Matheus',
    verifiedAt: '2025-10-27T00:00:00.000Z',
  }
  const automaticValidation = {
    type: 'automatic' as const,
    ups: 0,
    downs: 0,
  }

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
      validation: manualValidation,
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
      validation: automaticValidation,
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
      validation: automaticValidation,
    },
    {
      id: '2',
      name: 'corner-py/examples',
      license: 'MIT',
      stars: 89,
      forks: 23,
      url: 'https://github.com/corner-py/examples',
      validation: manualValidation,
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
      validation: automaticValidation,
    },
  ]

  const mockOtherRepositories = [
    {
      id: '1',
      url: 'https://arxiv.org/abs/2301.12345',
      validation: automaticValidation,
    },
    {
      id: '2',
      url: 'https://researchgate.net/publication/123456789',
      validation: manualValidation,
    },
    {
      id: '3',
      url: 'https://repository.university.edu/handle/123456789',
      validation: automaticValidation,
    },
  ]

  const result: ListByPaperNameResponse = {
    artifacts: {
      zenodo: mockZenodoArtifacts,
      github: mockGitHubArtifacts,
      figshare: mockFigshareArtifacts,
      other: mockOtherRepositories,
    },
  }

  return NextResponse.json(result)
}
