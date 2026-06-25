import { useMemo } from 'react'
import { useApp } from '../context'
import type { AppData, Selection } from '../data'

type Step = {
  priority: 1 | 2 | 3 | 4
  label: string
  sub: string
  sel: Selection
}

const PRIORITY_LABEL: Record<number, string> = {
  1: 'Interview',
  2: 'Follow-up',
  3: 'Reach out',
  4: 'Apply',
}

const PRIORITY_COLOR: Record<number, string> = {
  1: '#fbbf24',
  2: '#34d399',
  3: '#60a5fa',
  4: '#a78bfa',
}

function buildSteps(data: AppData): Step[] {
  const steps: Step[] = []

  const personById = new Map(data.people.map((p) => [p.id, p]))
  const connsByCompany = new Map<string, string[]>()
  data.connections.forEach((conn) => {
    if (!connsByCompany.has(conn.companyId)) connsByCompany.set(conn.companyId, [])
    connsByCompany.get(conn.companyId)!.push(conn.personId)
  })

  // P1: actively interviewing somewhere
  data.companies.forEach((c) => {
    if (c.applicationStatus === 'interviewing') {
      steps.push({
        priority: 1,
        label: `Prep for ${c.name}`,
        sub: 'Interview in progress',
        sel: { kind: 'company', id: c.id },
      })
    }
  })

  // P2: someone responded — schedule a call
  data.people.forEach((p) => {
    if (p.outreachStatus === 'responded') {
      steps.push({
        priority: 2,
        label: `Book a call with ${p.name}`,
        sub: p.currentCompany ? `At ${p.currentCompany}` : 'Responded to outreach',
        sel: { kind: 'person', id: p.id },
      })
    }
  })

  // P3: S-tier company has connections but nobody reached out yet
  const seenCompanyForReach = new Set<string>()
  data.companies
    .filter((c) => c.tier === 'S' && (!c.applicationStatus || c.applicationStatus === 'not_applied'))
    .forEach((c) => {
      const personIds = connsByCompany.get(c.id) ?? []
      const uncontacted = personIds.filter((pid) => {
        const p = personById.get(pid)
        return p && (!p.outreachStatus || p.outreachStatus === 'not_contacted')
      })
      if (uncontacted.length > 0 && !seenCompanyForReach.has(c.id)) {
        seenCompanyForReach.add(c.id)
        const p = personById.get(uncontacted[0])!
        steps.push({
          priority: 3,
          label: `Reach out to ${p.name}`,
          sub: `Connection at ${c.name}`,
          sel: { kind: 'person', id: p.id },
        })
      }
    })

  // P4: warm contact (met / referred) but not applied yet
  const seenCompanyForApply = new Set<string>()
  data.companies
    .filter((c) => !c.applicationStatus || c.applicationStatus === 'not_applied')
    .forEach((c) => {
      const personIds = connsByCompany.get(c.id) ?? []
      const hasWarm = personIds.some((pid) => {
        const p = personById.get(pid)
        return p && (p.outreachStatus === 'met' || p.outreachStatus === 'referred')
      })
      if (hasWarm && !seenCompanyForApply.has(c.id)) {
        seenCompanyForApply.add(c.id)
        steps.push({
          priority: 4,
          label: `Apply to ${c.name}`,
          sub: 'Warm contact ready',
          sel: { kind: 'company', id: c.id },
        })
      }
    })

  return steps.slice(0, 8)
}

type Props = {
  onClose: () => void
  onSelect: (sel: Selection) => void
}

export default function NextStepsCard({ onClose, onSelect }: Props) {
  const { data } = useApp()
  const steps = useMemo(() => buildSteps(data), [data])

  return (
    <div
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)',
        color: 'var(--text-primary)',
      }}
      className="absolute top-14 left-4 z-40 w-[280px] rounded-xl border shadow-xl overflow-hidden"
    >
      {/* Header */}
      <div
        style={{ borderBottomColor: 'var(--border)' }}
        className="flex items-center justify-between px-3.5 py-2.5 border-b"
      >
        <span className="text-[12px] font-semibold tracking-tight">Next Steps</span>
        <button
          onClick={onClose}
          style={{ color: 'var(--text-secondary)' }}
          className="text-[16px] leading-none hover:opacity-70 transition-opacity"
        >
          ×
        </button>
      </div>

      {/* Steps list */}
      <div className="py-1 max-h-[340px] overflow-y-auto">
        {steps.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }} className="text-[11px] px-3.5 py-3">
            No actions needed — you're on top of it.
          </p>
        ) : (
          steps.map((step, i) => (
            <button
              key={i}
              onClick={() => onSelect(step.sel)}
              className="w-full flex items-start gap-2.5 px-3.5 py-2 text-left hover:opacity-80 transition-opacity"
            >
              <span
                style={{
                  backgroundColor: PRIORITY_COLOR[step.priority] + '22',
                  color: PRIORITY_COLOR[step.priority],
                  fontSize: '8px',
                  lineHeight: 1,
                }}
                className="mt-0.5 shrink-0 rounded px-1.5 py-1 font-bold uppercase tracking-wider"
              >
                {PRIORITY_LABEL[step.priority]}
              </span>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-medium leading-snug truncate">{step.label}</span>
                <span style={{ color: 'var(--text-secondary)' }} className="text-[10px] leading-snug truncate">
                  {step.sub}
                </span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
