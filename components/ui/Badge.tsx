'use client'

import { cn } from '@/lib/utils'

type Variant = 'purpose' | 'stage' | 'status' | 'relevance' | 'eventType' | 'momentum' | 'default'

const purposeColors: Record<string, string> = {
  INVESTOR: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  MENTOR: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  PEER: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  RECRUIT: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  PARTNER: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  FOUNDER: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
}

const stageColors: Record<string, string> = {
  PRE_SEED: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
  SEED: 'bg-lime-100 text-lime-700 dark:bg-lime-900/40 dark:text-lime-300',
  SERIES_A: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
  SERIES_B: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  GROWTH: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  PUBLIC: 'bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300',
}

const statusColors: Record<string, string> = {
  MONITORING: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
  APPLIED: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  INTERVIEWING: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  PORTFOLIO: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  PASSED: 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-500 line-through',
}

const relevanceColors: Record<string, string> = {
  HIRING: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  INVESTOR: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  BUILDER: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  CONNECTOR: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
}

const momentumColors: Record<string, string> = {
  SURGING: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  UP: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  FLAT: 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400',
}

const labelMap: Record<string, string> = {
  PRE_SEED: 'Pre-seed',
  SEED: 'Seed',
  SERIES_A: 'Series A',
  SERIES_B: 'Series B',
  GROWTH: 'Growth',
  PUBLIC: 'Public',
  MONITORING: 'Monitoring',
  APPLIED: 'Applied',
  INTERVIEWING: 'Interviewing',
  PORTFOLIO: 'Portfolio',
  PASSED: 'Passed',
  DEMO_DAY: 'Demo Day',
  SURGING: '↑↑ Surging',
  UP: '↑ Up',
  FLAT: '→ Flat',
}

interface BadgeProps {
  value: string
  variant?: Variant
  className?: string
}

function getColors(variant: Variant, value: string): string {
  switch (variant) {
    case 'purpose': return purposeColors[value] || 'bg-neutral-100 text-neutral-600'
    case 'stage': return stageColors[value] || 'bg-neutral-100 text-neutral-600'
    case 'status': return statusColors[value] || 'bg-neutral-100 text-neutral-600'
    case 'relevance': return relevanceColors[value] || 'bg-neutral-100 text-neutral-600'
    case 'momentum': return momentumColors[value] || 'bg-neutral-100 text-neutral-600'
    default: return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300'
  }
}

export function Badge({ value, variant = 'default', className }: BadgeProps) {
  const label = labelMap[value] ?? value.replace(/_/g, ' ')
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium whitespace-nowrap',
        getColors(variant, value),
        className
      )}
    >
      {label}
    </span>
  )
}
