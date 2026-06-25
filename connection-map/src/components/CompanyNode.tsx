import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { APP_STATUS_COLOR, APP_STATUS_LABEL, type ApplicationStatus, type Company } from '../data'

type CompanyNodeData = Company & { selected?: boolean; dimmed?: boolean }

function CompanyNode({ data }: NodeProps) {
  const d = data as CompanyNodeData
  const status: ApplicationStatus = d.applicationStatus ?? 'not_applied'
  const statusColor = APP_STATUS_COLOR[status]
  const showStatus = status !== 'not_applied'

  return (
    <div
      style={{
        backgroundColor: 'var(--node-bg)',
        borderColor: d.selected ? 'var(--text-primary)' : 'var(--border)',
        borderWidth: d.selected ? '1.5px' : '1px',
        opacity: d.dimmed ? 0.18 : 1,
        transition: 'opacity 0.2s ease, border-color 0.15s ease',
        // Status accent: subtle left border
        borderLeft: showStatus ? `3px solid ${statusColor}` : undefined,
      }}
      className="rounded-[10px] border px-3 py-2.5 w-[210px] shadow-sm cursor-pointer select-none"
    >
      <Handle type="target" position={Position.Bottom} style={{ opacity: 0, pointerEvents: 'none' }} />

      <div className="flex items-center justify-between gap-1.5 mb-1">
        <span style={{ color: 'var(--text-primary)' }} className="font-semibold text-[12px] leading-tight tracking-tight truncate">
          {d.name}
        </span>
        <span
          style={{
            backgroundColor: d.tier === 'S' ? 'var(--text-primary)' : 'var(--border)',
            color: d.tier === 'S' ? 'var(--node-bg)' : 'var(--text-secondary)',
            fontSize: '9px',
          }}
          className="shrink-0 rounded px-1.5 py-0.5 font-bold uppercase tracking-wide"
        >
          {d.tier}
        </span>
      </div>

      <div className="space-y-0.5 mb-1.5">
        {d.roles.slice(0, 2).map((r) => (
          <div key={r.id} style={{ color: 'var(--text-secondary)' }} className="text-[10px] leading-snug truncate">
            {r.title}
          </div>
        ))}
        {d.roles.length > 2 && (
          <div style={{ color: 'var(--text-secondary)' }} className="text-[10px]">
            +{d.roles.length - 2} more
          </div>
        )}
      </div>

      {showStatus && (
        <div
          style={{ color: statusColor, fontSize: '10px' }}
          className="font-medium"
        >
          {APP_STATUS_LABEL[status]}
        </div>
      )}
    </div>
  )
}

export default memo(CompanyNode)
