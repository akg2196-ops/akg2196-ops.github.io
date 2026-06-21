import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const notes = await prisma.note.findMany({
    where: { contactId: params.id },
    orderBy: { meetingDate: 'desc' },
  })
  return NextResponse.json(notes)
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json()
  const note = await prisma.note.create({
    data: {
      contactId: params.id,
      body: body.body,
      meetingDate: new Date(body.meetingDate || new Date()),
      purpose: body.purpose || 'General',
    },
  })
  return NextResponse.json(note, { status: 201 })
}
