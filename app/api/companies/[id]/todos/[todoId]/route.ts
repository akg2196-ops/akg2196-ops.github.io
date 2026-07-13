import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: { id: string; todoId: string } }
) {
  const body = await request.json()
  const todo = await prisma.todo.update({
    where: { id: params.todoId },
    data: body,
  })
  return NextResponse.json(todo)
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string; todoId: string } }
) {
  await prisma.todo.delete({ where: { id: params.todoId } })
  return NextResponse.json({ success: true })
}
