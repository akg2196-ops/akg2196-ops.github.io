import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json()
  const exec = await prisma.exec.update({
    where: { id: params.id },
    data: body,
    include: { company: true },
  })
  return NextResponse.json(exec)
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  await prisma.exec.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
