import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { parseJsonArray } from '@/lib/utils'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const purposeFilter = searchParams.get('purpose')
  const companyId = searchParams.get('companyId')
  const search = searchParams.get('search')
  const minStrength = searchParams.get('minStrength')

  const contacts = await prisma.contact.findMany({
    where: {
      ...(purposeFilter ? { purpose: purposeFilter as never } : {}),
      ...(companyId ? { companyId } : {}),
      ...(search ? { name: { contains: search } } : {}),
      ...(minStrength ? { strength: { gte: Number(minStrength) } } : {}),
    },
    include: {
      company: true,
      _count: { select: { notes: true } },
    },
    orderBy: { lastContact: 'desc' },
  })

  return NextResponse.json(
    contacts.map((c) => ({ ...c, tags: parseJsonArray(c.tags) }))
  )
}

export async function POST(request: Request) {
  const body = await request.json()
  const { tags, ...rest } = body

  const contact = await prisma.contact.create({
    data: {
      ...rest,
      tags: JSON.stringify(tags || []),
      lastContact: new Date(rest.lastContact || new Date()),
    },
    include: { company: true, _count: { select: { notes: true } } },
  })

  return NextResponse.json({ ...contact, tags: parseJsonArray(contact.tags) }, { status: 201 })
}
