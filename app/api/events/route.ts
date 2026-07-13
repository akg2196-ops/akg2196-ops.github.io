import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { parseJsonArray } from '@/lib/utils'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')
  const city = searchParams.get('city')

  const events = await prisma.event.findMany({
    where: {
      ...(type ? { type: type as never } : {}),
      ...(city ? { location: { contains: city } } : {}),
    },
    orderBy: { date: 'asc' },
  })

  return NextResponse.json(events.map((e) => ({ ...e, tags: parseJsonArray(e.tags) })))
}

export async function POST(request: Request) {
  const body = await request.json()
  const { tags, ...rest } = body
  const event = await prisma.event.create({
    data: { ...rest, tags: JSON.stringify(tags || []) },
  })
  return NextResponse.json({ ...event, tags: parseJsonArray(event.tags) }, { status: 201 })
}
