import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const company = await prisma.company.findUnique({
    where: { id: params.id },
    include: {
      todos: { orderBy: { createdAt: 'asc' } },
      contacts: { include: { _count: { select: { notes: true } } } },
      execs: true,
    },
  })
  if (!company) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(company)
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json()
  const company = await prisma.company.update({
    where: { id: params.id },
    data: body,
    include: {
      todos: { orderBy: { createdAt: 'asc' } },
      contacts: true,
      execs: true,
    },
  })
  return NextResponse.json(company)
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  await prisma.company.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
