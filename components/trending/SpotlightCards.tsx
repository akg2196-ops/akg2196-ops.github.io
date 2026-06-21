'use client'

import type { Trend } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { ExternalLink } from 'lucide-react'

export function SpotlightCards({ trends }: { trends: Trend[] }) {
  if (trends.length === 0) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {trends.map((trend) => (
        <div
          key={trend.id}
          className="rounded-card border border-accent/30 bg-gradient-to-br from-accent/5 to-transparent p-5 space-y-3"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-mono text-accent uppercase tracking-wide mb-0.5">Spotlight</p>
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{trend.companyName}</h3>
            </div>
            <Badge value={trend.momentum} variant="momentum" />
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">{trend.why}</p>
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold text-accent">{trend.metric}</span>
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
      ))}
    </div>
  )
}
