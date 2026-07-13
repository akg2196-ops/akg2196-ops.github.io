import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { parseJsonArray } from '@/lib/utils'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json()
  const { companyTags, ...rest } = body
  const article = await prisma.article.update({
    where: { id: params.id },
    data: {
      ...rest,
      ...(companyTags !== undefined ? { companyTags: JSON.stringify(companyTags) } : {}),
    },
  })
  return NextResponse.json({ ...article, companyTags: parseJsonArray(article.companyTags) })
}
