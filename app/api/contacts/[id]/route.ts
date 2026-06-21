import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { parseJsonArray } from '@/lib/utils'

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const contact = await prisma.contact.findUnique({
    where: { id: params.id },
    include: {
      company: true,
      notes: { orderBy: { meetingDate: 'desc' } },
      _count: { select: { notes: true } },
    },
  })

  if (!contact) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({ ...contact, tags: parseJsonArray(contact.tags) })
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json()
  const { tags, ...rest } = body

  const contact = await prisma.contact.update({
    where: { id: params.id },
    data: {
      ...rest,
      ...(tags !== undefined ? { tags: JSON.stringify(tags) } : {}),
      ...(rest.lastContact ? { lastContact: new Date(rest.lastContact) } : {}),
    },
    include: {
      company: true,
      _count: { select: { notes: true } },
    },
  })

  return NextResponse.json({ ...contact, tags: parseJsonArray(contact.tags) })
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  await prisma.contact.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
