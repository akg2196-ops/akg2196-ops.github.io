import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { Company } from '../data'

type CompanyNodeData = Company & { selected?: boolean; dimmed?: boolean }

function CompanyNode({ data }: NodeProps) {
  const d = data as CompanyNodeData
  const eligible = d.roles.some((r) => r.eligible)

  return (
    <div
      style={{
        backgroundColor: 'var(--node-bg)',
        borderColor: d.selected ? 'var(--text-primary)' : 'var(--border)',
        opacity: d.dimmed ? 0.25 : 1,
        borderWidth: d.selected ? '1.5px' : '1px',
        transition: 'opacity 0.2s ease, border-color 0.15s ease',
      }}
      className="rounded-[10px] border px-4 py-3 w-[220px] shadow-sm cursor-pointer select-none"
    >
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0, pointerEvents: 'none' }} />
      <Handle type="target" position={Position.Bottom} style={{ opacity: 0, pointerEvents: 'none' }} />

      <div className="flex items-start justify-between gap-2 mb-2">
        <span
          style={{ color: 'var(--text-primary)' }}
          className="font-semibold text-[13px] leading-tight tracking-tight"
        >
          {d.name}
        </span>
        {eligible && (
          <span
            style={{
              backgroundColor: 'var(--border)',
              color: 'var(--text-secondary)',
              fontSize: '10px',
            }}
            className="rounded px-1.5 py-0.5 shrink-0 font-medium uppercase tracking-wide"
          >
            Eligible
          </span>
        )}
      </div>

      <div className="space-y-1">
        {d.roles.map((r) => (
          <a
            key={r.url + r.title}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{ color: d.selected ? 'var(--text-primary)' : 'var(--text-secondary)' }}
            className="block text-[11px] leading-snug hover:underline truncate"
          >
            {r.title}
          </a>
        ))}
      </div>

      {d.applicationDeadline && (
        <div
          style={{ color: 'var(--text-secondary)', borderTopColor: 'var(--border)' }}
          className="text-[10px] mt-2 pt-2 border-t"
        >
          Deadline: {d.applicationDeadline}
        </div>
      )}
    </div>
  )
}

export default memo(CompanyNode)
