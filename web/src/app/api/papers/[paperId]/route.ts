import { NextResponse } from 'next/server'
import { FindPaperByIdResponse } from '@/lib/service/papers'
import { MOCK_PAPERS } from '../mockData'

export async function GET(
  _request: Request,
  context: { params: Promise<{ paperId: string }> },
) {
  const { paperId } = await context.params
  const paper = MOCK_PAPERS.find((p) => p.id === Number(paperId))

  if (!paper) {
    return NextResponse.json({ error: 'Paper not found' }, { status: 404 })
  }

  const response: FindPaperByIdResponse = paper
  return NextResponse.json(response)
}
