import { NextResponse } from 'next/server'
import { ListPapersResponse } from '@/lib/service/papers'
import { MOCK_PAPERS } from './mockData'

export async function GET() {
  const response: ListPapersResponse = MOCK_PAPERS
  return NextResponse.json(response)
}
