'use client'

import { useEffect, useState } from 'react'
import type { Company } from '@/types'
import { ArticleList } from '@/components/feed/ArticleList'

export default function FeedPage() {
  const [companies, setCompanies] = useState<Company[]>([])

  useEffect(() => {
    fetch('/api/companies').then((r) => r.json()).then(setCompanies)
  }, [])

  return (
    <div className="h-full flex flex-col">
      <ArticleList companies={companies} />
    </div>
  )
}
