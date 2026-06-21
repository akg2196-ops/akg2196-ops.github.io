import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { parseJsonArray } from '@/lib/utils'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json()
  const { tags, ...rest } = body
  const event = await prisma.event.update({
    where: { id: params.id },
    data: {
      ...rest,
      ...(tags !== undefined ? { tags: JSON.stringify(tags) } : {}),
    },
  })
  return NextResponse.json({ ...event, tags: parseJsonArray(event.tags) })
}
