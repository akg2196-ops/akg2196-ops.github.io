import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const trends = await prisma.trend.findMany({
    orderBy: { rank: 'asc' },
  })
  return NextResponse.json(trends)
}
