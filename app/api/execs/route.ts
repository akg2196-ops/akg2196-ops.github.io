import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const execs = await prisma.exec.findMany({
    include: { company: true },
    orderBy: { name: 'asc' },
  })
  return NextResponse.json(execs)
}

export async function POST(request: Request) {
  const body = await request.json()
  const exec = await prisma.exec.create({
    data: body,
    include: { company: true },
  })
  return NextResponse.json(exec, { status: 201 })
}
