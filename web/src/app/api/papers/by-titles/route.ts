import { type NextRequest } from 'next/server'

export async function POST(_request: NextRequest) {
  return Response.json([
    {
      id: 1,
      title:
        'Probing New physics with high-redshift quasars: axions and non-standard cosmology',
      artifacts: [
        {
          id: 1,
          name: 'Dataset',
          url: 'https://zenodo.org/record/123456',
        },
        {
          id: 2,
          name: 'Code',
          url: 'https://github.com/dfm/corner.py',
        },
        {
          id: 3,
          name: 'Forms',
          url: 'https://docs.google.com/forms/',
        },
      ],
    },
    {
      id: 3,
      title: 'uravu: Making Bayesian modelling easy (er)',
      artifacts: [
        {
          id: 6,
          name: 'Vue.js',
          url: 'https://github.com/vuejs/core',
        },
      ],
    },
  ])
}
