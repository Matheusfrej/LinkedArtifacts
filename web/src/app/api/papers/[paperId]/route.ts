import { type NextRequest } from 'next/server'
import { FindPaperByIdResponse } from '../../../../lib/service/papers'

export async function GET(
  _request: NextRequest,
  { params }: { params: { paperId: string } },
) {
  const papers = [
    {
      id: 1,
      title:
        'Probing New physics with high-redshift quasars: axions and non-standard cosmology',
      doi: null,
    },
    {
      id: 2,
      title:
        'Some models are useful, but how do we know which ones? Towards a unified Bayesian model taxonomy',
      doi: null,
    },
    {
      id: 3,
      title: 'uravu: Making Bayesian modelling easy (er)',
      doi: null,
    },
    {
      id: 4,
      title:
        'Overscreening and underscreening in solid-electrolyte grain boundary space-charge layers',
      doi: null,
    },
    {
      id: 5,
      title:
        'PyAutoFit: A Classy Probabilistic Programming Language for Model Composition and Fitting',
      doi: null,
    },
    {
      id: 6,
      title: 'Bayes rules!: An introduction to applied Bayesian modeling',
      doi: null,
    },
    {
      id: 7,
      title: 'Learning Bayesian Models with R',
      doi: null,
    },
  ]

  const response: FindPaperByIdResponse = papers.find(
    (p) => p.id === Number(params.paperId),
  )!

  return Response.json(response)
}
