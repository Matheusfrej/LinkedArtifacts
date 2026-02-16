import type { ListArtifactsByPaperIdResponse } from '@/lib/service/artifacts/listArtifactsByPaperId'

import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const paperId = searchParams.get('paperId')
  const artifacts: ListArtifactsByPaperIdResponse = [
    {
      id: 1,
      name: 'Dataset',
      url: 'https://zenodo.org/record/123456',
      paperId: 1,
    },
    {
      id: 2,
      name: 'Code',
      url: 'https://github.com/dfm/corner.py',
      paperId: 1,
    },
    {
      id: 3,
      name: 'Forms',
      url: 'https://docs.google.com/forms/',
      paperId: 1,
    },
    {
      id: 4,
      name: 'Hello World',
      url: 'https://github.com/octocat/Hello-World',
      paperId: 2,
    },
    {
      id: 5,
      name: 'Code 2',
      url: 'https://github.com/tensorflow/tensorflow',
      paperId: 2,
    },
    {
      id: 6,
      name: 'Vue.js',
      url: 'https://github.com/vuejs/core',
      paperId: 3,
    },
    {
      id: 7,
      name: 'Dataset Kaggle',
      url: 'https://www.kaggle.com/datasets',
      paperId: 5,
    },
    {
      id: 8,
      name: 'Another Dataset',
      url: 'https://www.kaggle.com/datasets/uciml/iris',
      paperId: 5,
    },
    {
      id: 9,
      name: 'Dataset 3',
      url: 'https://archive.ics.uci.edu/',
      paperId: 7,
    },
  ]

  return Response.json(
    paperId
      ? artifacts.filter((a) => a.paperId === Number(paperId))
      : artifacts,
  )
}
