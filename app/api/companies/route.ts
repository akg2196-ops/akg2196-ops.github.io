import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const companies = await prisma.company.findMany({
    include: {
      todos: { orderBy: { createdAt: 'asc' } },
      contacts: true,
      execs: true,
    },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(companies)
}

export async function POST(request: Request) {
  const body = await request.json()
  const company = await prisma.company.create({
    data: body,
    include: { todos: true, contacts: true, execs: true },
  })
  return NextResponse.json(company, { status: 201 })
}
