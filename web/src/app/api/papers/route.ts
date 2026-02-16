import { type NextRequest } from 'next/server'

export async function GET(_request: NextRequest) {
  return Response.json([
    {
      id: 1,
      title:
        'Probing New physics with high-redshift quasars: axions and non-standard cosmology',
      doi: null,
      createdAt: '2026-02-16T12:37:49.165Z',
    },
    {
      id: 2,
      title:
        'Some models are useful, but how do we know which ones? Towards a unified Bayesian model taxonomy',
      doi: null,
      createdAt: '2026-02-16T12:38:07.349Z',
    },
    {
      id: 3,
      title: 'uravu: Making Bayesian modelling easy (er)',
      doi: null,
      createdAt: '2026-02-16T12:38:16.423Z',
    },
    {
      id: 4,
      title:
        'Overscreening and underscreening in solid-electrolyte grain boundary space-charge layers',
      doi: null,
      createdAt: '2026-02-16T12:38:27.161Z',
    },
    {
      id: 5,
      title:
        'PyAutoFit: A Classy Probabilistic Programming Language for Model Composition and Fitting',
      doi: null,
      createdAt: '2026-02-16T12:38:51.232Z',
    },
    {
      id: 6,
      title: 'Bayes rules!: An introduction to applied Bayesian modeling',
      doi: null,
      createdAt: '2026-02-16T12:39:00.131Z',
    },
    {
      id: 7,
      title: 'Learning Bayesian Models with R',
      doi: null,
      createdAt: '2026-02-16T12:39:09.810Z',
    },
  ])
}
