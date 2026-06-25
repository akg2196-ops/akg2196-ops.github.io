import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { Person } from '../data'

type PersonNodeData = Person & { selected?: boolean; dimmed?: boolean; highlighted?: boolean }

function PersonNode({ data }: NodeProps) {
  const d = data as PersonNodeData

  const initials = d.name
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div
      style={{
        opacity: d.dimmed ? 0.2 : 1,
        transition: 'opacity 0.2s ease',
      }}
      className="flex flex-col items-center gap-2 cursor-pointer select-none"
    >
      <Handle type="source" position={Position.Top} style={{ opacity: 0, pointerEvents: 'none' }} />
      <Handle type="target" position={Position.Top} style={{ opacity: 0, pointerEvents: 'none' }} />

      {/* Circle avatar */}
      <div
        style={{
          backgroundColor: d.selected || d.highlighted ? 'var(--text-primary)' : 'var(--node-bg)',
          borderColor: d.selected || d.highlighted ? 'var(--text-primary)' : 'var(--border)',
          color: d.selected || d.highlighted ? 'var(--node-bg)' : 'var(--text-secondary)',
          borderWidth: d.selected ? '1.5px' : '1px',
          transition: 'background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease',
        }}
        className="w-12 h-12 rounded-full border flex items-center justify-center font-semibold text-[13px] shrink-0"
      >
        {initials}
      </div>

      {/* Label below circle */}
      <div className="flex flex-col items-center text-center w-[130px]">
        <span
          style={{ color: 'var(--text-primary)' }}
          className="text-[12px] font-medium leading-tight truncate w-full text-center"
        >
          {d.name}
        </span>
        <span
          style={{ color: 'var(--text-secondary)' }}
          className="text-[10px] leading-tight truncate w-full text-center mt-0.5"
        >
          {d.role}
        </span>
        <span
          style={{ color: 'var(--text-secondary)' }}
          className="text-[10px] leading-tight truncate w-full text-center"
        >
          {d.currentCompany}
        </span>
      </div>
    </div>
  )
}

export default memo(PersonNode)
