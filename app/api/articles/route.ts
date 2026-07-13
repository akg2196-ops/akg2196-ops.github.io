import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { parseJsonArray } from '@/lib/utils'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const companyTag = searchParams.get('companyTag')

  const articles = await prisma.article.findMany({
    where: {
      ...(category && category !== 'ALL' ? { category: category as never } : {}),
    },
    orderBy: { publishedAt: 'desc' },
  })

  let result = articles.map((a) => ({ ...a, companyTags: parseJsonArray(a.companyTags) }))

  if (companyTag) {
    result = result.filter((a) =>
      a.companyTags.some((t) => t.toLowerCase() === companyTag.toLowerCase())
    )
  }

  return NextResponse.json(result)
}
