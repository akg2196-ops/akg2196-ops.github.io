'use client'

import { useState } from 'react'
import { ExternalLink, ArrowUpDown } from 'lucide-react'
import { format } from 'date-fns'
import type { Trend, Momentum } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

type SortKey = 'rank' | 'momentum' | 'sector'

const MOMENTUM_ORDER: Momentum[] = ['SURGING', 'UP', 'FLAT']

function MomentumIndicator({ value }: { value: Momentum }) {
  const config = {
    SURGING: { symbol: '↑↑', className: 'text-green-500' },
    UP: { symbol: '↑', className: 'text-blue-500' },
    FLAT: { symbol: '→', className: 'text-neutral-400' },
  }[value]

  return (
    <span className={cn('font-mono font-bold text-base', config.className)}>
      {config.symbol}
    </span>
  )
}

interface TrendListProps {
  trends: Trend[]
  updatedAt?: string
}

export function TrendList({ trends, updatedAt }: TrendListProps) {
  const [sortKey, setSortKey] = useState<SortKey>('rank')

  const sorted = [...trends].sort((a, b) => {
    switch (sortKey) {
      case 'momentum':
        return MOMENTUM_ORDER.indexOf(a.momentum) - MOMENTUM_ORDER.indexOf(b.momentum)
      case 'sector':
        return a.sector.localeCompare(b.sector)
      default:
        return a.rank - b.rank
    }
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-500">Sort by:</span>
          {(['rank', 'momentum', 'sector'] as SortKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setSortKey(key)}
              className={cn(
                'px-2.5 py-1 rounded text-xs font-medium transition-colors',
                sortKey === key
                  ? 'bg-accent text-white'
                  : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              )}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>
        {updatedAt && (
          <p className="text-xs font-mono text-neutral-400">
            Updated {format(new Date(updatedAt), 'MMM d, HH:mm')}
          </p>
        )}
      </div>

      <div className="space-y-2">
        {sorted.map((trend, idx) => {
          const isTop3 = trend.rank <= 3

          return (
            <div
              key={trend.id}
              className={cn(
                'flex items-center gap-4 px-5 py-4 rounded-card border transition-colors',
                isTop3
                  ? 'border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 animate-pulse2'
                  : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900',
                isTop3 && 'animate-none hover:border-accent/40'
              )}
              style={isTop3 ? { animation: 'pulse2 3s ease-in-out infinite' } : {}}
            >
              {/* Rank */}
              <span className={cn(
                'font-mono font-bold shrink-0 w-8 text-right',
                isTop3 ? 'text-2xl text-neutral-900 dark:text-neutral-100' : 'text-lg text-neutral-400'
              )}>
                {trend.rank}
              </span>

              {/* Logo placeholder */}
              <div className="w-9 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-base font-bold text-neutral-400 shrink-0">
                {trend.companyName[0]}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
                    {trend.companyName}
                  </span>
                  <Badge value={trend.sector} variant="default" />
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{trend.why}</p>
              </div>

              {/* Metric */}
              <span className="hidden md:block font-mono text-xs text-neutral-500 shrink-0 max-w-[140px] text-right">
                {trend.metric}
              </span>

              {/* Momentum */}
              <div className="flex items-center gap-2 shrink-0">
                <MomentumIndicator value={trend.momentum} />
                {trend.link && (
                  <a
                    href={trend.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-accent transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
