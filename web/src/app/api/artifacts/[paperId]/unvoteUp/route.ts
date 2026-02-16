import { type NextRequest } from 'next/server'

export async function POST(
  _request: NextRequest,
  { params }: { params: { paperName: string } },
) {
  return Response.json({})
}
