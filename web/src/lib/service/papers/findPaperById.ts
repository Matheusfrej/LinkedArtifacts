import api from '..'
import { Paper } from './types'

export interface FindPaperByIdRequest {
  id: number
}

export type FindPaperByIdResponse = Paper

export async function findPaperById(
  params: FindPaperByIdRequest,
): Promise<FindPaperByIdResponse> {
  const url = `/papers/${params.id}`
  const { data } = await api.get(url)
  return data
}

