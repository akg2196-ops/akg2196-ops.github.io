import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const todos = await prisma.todo.findMany({
    where: { companyId: params.id },
    orderBy: { createdAt: 'asc' },
  })
  return NextResponse.json(todos)
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { label } = await request.json()
  const todo = await prisma.todo.create({
    data: { companyId: params.id, label, done: false },
  })
  return NextResponse.json(todo, { status: 201 })
}
