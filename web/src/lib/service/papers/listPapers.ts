import api from '..'
import { Paper } from './types'

export type ListPapersResponse = Paper[]

export async function listPapers(): Promise<ListPapersResponse> {
  const url = `/papers`
  const { data } = await api.get(url)
  return data
}

