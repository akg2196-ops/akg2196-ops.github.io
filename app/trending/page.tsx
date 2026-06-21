'use client'

import { useEffect, useState } from 'react'
import type { Trend } from '@/types'
import { SpotlightCards } from '@/components/trending/SpotlightCards'
import { TrendList } from '@/components/trending/TrendList'

export default function TrendingPage() {
  const [trends, setTrends] = useState<Trend[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/trends')
      .then((r) => r.json())
      .then((data) => { setTrends(data); setLoading(false) })
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-neutral-400 text-sm">Loading…</div>
  }

  const spotlight = trends.filter((t) => t.spotlight)
  const updatedAt = trends[0]?.updatedAt

  return (
    <div className="p-6 max-w-4xl">
      <SpotlightCards trends={spotlight} />
      <TrendList trends={trends} updatedAt={updatedAt} />
    </div>
  )
}
