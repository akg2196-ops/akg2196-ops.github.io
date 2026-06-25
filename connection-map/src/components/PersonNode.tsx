import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { Person } from '../data'

type PersonNodeData = Person & {
  selected?: boolean
  dimmed?: boolean
  highlighted?: boolean
}

function PersonNode({ data }: NodeProps) {
  const d = data as PersonNodeData

  const initials = (d.name ?? '?')
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const active = d.selected || d.highlighted

  return (
    <div
      style={{ opacity: d.dimmed ? 0.18 : 1, transition: 'opacity 0.2s ease' }}
      className="flex flex-col items-center gap-1.5 cursor-pointer select-none"
    >
      <Handle type="source" position={Position.Top} style={{ opacity: 0, pointerEvents: 'none' }} />

      <div
        style={{
          backgroundColor: active ? 'var(--text-primary)' : 'var(--node-bg)',
          borderColor: active ? 'var(--text-primary)' : 'var(--border)',
          color: active ? 'var(--node-bg)' : 'var(--text-secondary)',
          borderWidth: d.selected ? '1.5px' : '1px',
          transition: 'all 0.15s ease',
        }}
        className="w-11 h-11 rounded-full border flex items-center justify-center font-semibold text-[12px] shrink-0"
      >
        {initials}
      </div>

      <div className="flex flex-col items-center text-center w-[120px]">
        <span
          style={{ color: 'var(--text-primary)' }}
          className="text-[11px] font-medium leading-tight w-full text-center"
        >
          {d.name}
        </span>
        {d.currentCompany && (
          <span
            style={{ color: 'var(--text-secondary)' }}
            className="text-[9px] leading-tight w-full text-center mt-0.5 truncate"
          >
            {d.currentCompany}
          </span>
        )}
      </div>
    </div>
  )
}

export default memo(PersonNode)
