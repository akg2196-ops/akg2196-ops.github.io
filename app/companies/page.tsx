'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { LayoutGrid, GitFork } from 'lucide-react'
import type { Company } from '@/types'
import { CompanyGrid } from '@/components/companies/CompanyGrid'
import { CompanyGraph } from '@/components/companies/CompanyGraph'
import { CompanyPanel } from '@/components/companies/CompanyPanel'
import { useOrbitStore } from '@/store/useOrbitStore'
import { cn } from '@/lib/utils'

type ViewMode = 'graph' | 'grid'

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<ViewMode>('graph')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const { theme } = useOrbitStore()

  useEffect(() => {
    fetch('/api/companies')
      .then((r) => r.json())
      .then((data) => { setCompanies(data); setLoading(false) })
  }, [])

  // Deep-link support: /companies?id=xxx
  useEffect(() => {
    const id = searchParams.get('id')
    if (id) setSelectedId(id)
  }, [searchParams])

  const handleSelect = useCallback((id: string) => setSelectedId(id), [])

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-neutral-400 text-sm">Loading…</div>
  }

  if (companies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-neutral-400">
        <p className="text-sm">No companies on your watchlist yet.</p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* View toggle */}
      <div className="flex items-center gap-2 px-6 py-3 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
        <button
          onClick={() => setView('graph')}
          className={cn(
            'flex items-center gap-1.5 h-7 px-3 rounded-input text-xs font-medium transition-colors',
            view === 'graph'
              ? 'bg-accent text-white'
              : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          )}
        >
          <GitFork className="w-3.5 h-3.5" />
          Graph
        </button>
        <button
          onClick={() => setView('grid')}
          className={cn(
            'flex items-center gap-1.5 h-7 px-3 rounded-input text-xs font-medium transition-colors',
            view === 'grid'
              ? 'bg-accent text-white'
              : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          )}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          Grid
        </button>
        <span className="ml-auto text-xs font-mono text-neutral-400">{companies.length} companies</span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {view === 'graph' ? (
          <CompanyGraph
            companies={companies}
            onSelectCompany={handleSelect}
            isDark={theme === 'dark'}
          />
        ) : (
          <div className="h-full overflow-y-auto">
            <CompanyGrid
              companies={companies}
              onSelect={handleSelect}
              selectedId={selectedId}
            />
          </div>
        )}
      </div>

      <CompanyPanel
        companyId={selectedId}
        onClose={() => setSelectedId(null)}
      />
    </div>
  )
}
