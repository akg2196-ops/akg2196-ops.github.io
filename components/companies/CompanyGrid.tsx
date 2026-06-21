'use client'

import type { Company } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { Globe } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CompanyGridProps {
  companies: Company[]
  onSelect: (id: string) => void
  selectedId: string | null
}

export function CompanyGrid({ companies, onSelect, selectedId }: CompanyGridProps) {
  if (companies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-neutral-400">
        <p className="text-sm">No companies on your watchlist.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
      {companies.map((c) => (
        <div
          key={c.id}
          onClick={() => onSelect(c.id)}
          className={cn(
            'rounded-card border p-4 cursor-pointer transition-colors duration-[80ms]',
            selectedId === c.id
              ? 'border-accent bg-accent/5'
              : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700'
          )}
        >
          {/* Logo placeholder */}
          <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-3">
            <span className="text-lg font-bold text-neutral-400">{c.name[0]}</span>
          </div>

          <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 mb-1 truncate">
            {c.name}
          </h3>

          <p className="text-xs text-neutral-500 mb-3 line-clamp-2">
            {c.description || c.sector}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-3">
            <Badge value={c.sector} variant="default" className="text-xs" />
            <Badge value={c.stage} variant="stage" />
          </div>

          <div className="flex items-center justify-between">
            <Badge value={c.status} variant="status" />
            {c.website && (
              <a
                href={c.website}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-neutral-400 hover:text-accent transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
