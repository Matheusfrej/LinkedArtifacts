import { Paper } from '@/lib/service/papers'

export const MOCK_PAPERS: Paper[] = [
  {
    id: 1,
    title:
      'Probing New physics with high-redshift quasars: axions and non-standard cosmology',
    venue: 'Physical Review D',
    year: 2021,
    authors: 'John Doe; Jane Smith',
    pageCount: 12,
    doi: '10.1103/PhysRevD.103.043518',
    hasArtifact: true,
    badges: [
      { id: 1, name: 'Available' },
      { id: 2, name: 'Evaluated & Functional' },
    ],
    artifacts: [
      {
        id: 1,
        name: 'Dataset',
        url: 'https://zenodo.org/record/123456',
        doi: null,
      },
      {
        id: 2,
        name: 'Code',
        url: 'https://github.com/dfm/corner.py',
        doi: null,
      },
      {
        id: 3,
        name: 'Forms',
        url: 'https://docs.google.com/forms/',
        doi: null,
      },
    ],
  },
  {
    id: 2,
    title:
      'Some models are useful, but how do we know which ones? Towards a unified Bayesian model taxonomy',
    venue: 'Journal of Statistical Software',
    year: 2020,
    authors: 'Alice Johnson; Bob Brown',
    pageCount: 18,
    doi: null,
    hasArtifact: true,
    badges: [
      { id: 3, name: 'Available' },
      { id: 4, name: 'Evaluated & Reusable' },
    ],
    artifacts: [
      {
        id: 4,
        name: 'Hello World',
        url: 'https://github.com/octocat/Hello-World',
        doi: null,
      },
      {
        id: 5,
        name: 'Code 2',
        url: 'https://github.com/tensorflow/tensorflow',
        doi: null,
      },
    ],
  },
  {
    id: 3,
    title: 'uravu: Making Bayesian modelling easy (er)',
    venue: 'Journal of Open Source Software',
    year: 2019,
    authors: 'Charlie Green',
    pageCount: 5,
    doi: '10.21105/joss.01418',
    hasArtifact: true,
    badges: [
      { id: 5, name: 'Available' },
      { id: 6, name: 'Results Reproduced' },
    ],
    artifacts: [
      {
        id: 6,
        name: 'Vue.js',
        url: 'https://github.com/vuejs/core',
        doi: null,
      },
    ],
  },
  {
    id: 4,
    title:
      'Overscreening and underscreening in solid-electrolyte grain boundary space-charge layers',
    venue: 'Solid State Ionics',
    year: 2022,
    authors: 'David White; Eva Black',
    pageCount: 8,
    doi: null,
    hasArtifact: false,
    badges: [],
    artifacts: [],
  },
  {
    id: 5,
    title:
      'PyAutoFit: A Classy Probabilistic Programming Language for Model Composition and Fitting',
    venue: 'Computing in Science & Engineering',
    year: 2021,
    authors: 'James Nightingale; Richard Hayes',
    pageCount: 14,
    doi: '10.1109/MCSE.2021.3090000',
    hasArtifact: true,
    badges: [
      { id: 7, name: 'Available' },
      { id: 8, name: 'Results Replicated' },
    ],
    artifacts: [
      {
        id: 7,
        name: 'Dataset Kaggle',
        url: 'https://www.kaggle.com/datasets',
        doi: null,
      },
      {
        id: 8,
        name: 'Another Dataset',
        url: 'https://www.kaggle.com/datasets/uciml/iris',
        doi: null,
      },
    ],
  },
  {
    id: 6,
    title: 'Bayes rules!: An introduction to applied Bayesian modeling',
    venue: 'CRC Press',
    year: 2021,
    authors: 'Alicia A. Johnson; Miles Q. Ott; Mine Dogucu',
    pageCount: 400,
    doi: null,
    hasArtifact: false,
    badges: [],
    artifacts: [],
  },
  {
    id: 7,
    title: 'Learning Bayesian Models with R',
    venue: 'Springer',
    year: 2018,
    authors: 'Frank Miller',
    pageCount: 250,
    doi: null,
    hasArtifact: true,
    badges: [{ id: 9, name: 'Available' }],
    artifacts: [
      {
        id: 9,
        name: 'Dataset 3',
        url: 'https://archive.ics.uci.edu/',
        doi: null,
      },
    ],
  },
]
