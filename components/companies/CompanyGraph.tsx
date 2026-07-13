'use client'

import { useEffect, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'
import type { Company } from '@/types'

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false })

const STATUS_SIZE: Record<string, number> = {
  PORTFOLIO: 14,
  INTERVIEWING: 11,
  APPLIED: 9,
  MONITORING: 7,
  PASSED: 5,
}

const STATUS_COLOR: Record<string, string> = {
  PORTFOLIO: '#6366F1',
  INTERVIEWING: '#3B82F6',
  APPLIED: '#F59E0B',
  MONITORING: '#6B7280',
  PASSED: '#374151',
}

interface GraphNode {
  id: string
  name: string
  sector: string
  status: string
  val: number
  color: string
}

interface GraphLink {
  source: string
  target: string
}

interface CompanyGraphProps {
  companies: Company[]
  onSelectCompany: (id: string) => void
  isDark: boolean
}

export function CompanyGraph({ companies, onSelectCompany, isDark }: CompanyGraphProps) {
  const nodes: GraphNode[] = companies.map((c) => ({
    id: c.id,
    name: c.name,
    sector: c.sector,
    status: c.status,
    val: STATUS_SIZE[c.status] ?? 7,
    color: STATUS_COLOR[c.status] ?? '#6B7280',
  }))

  // Edges: connect companies that share a sector
  const links: GraphLink[] = []
  for (let i = 0; i < companies.length; i++) {
    for (let j = i + 1; j < companies.length; j++) {
      if (companies[i].sector === companies[j].sector) {
        links.push({ source: companies[i].id, target: companies[j].id })
      }
    }
  }

  const handleNodeClick = useCallback(
    (node: GraphNode) => { onSelectCompany(node.id) },
    [onSelectCompany]
  )

  const bg = isDark ? '#0A0A0B' : '#FAFAF9'
  const textColor = isDark ? '#e5e7eb' : '#111827'
  const linkColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'

  return (
    <div className="w-full h-full rounded-card overflow-hidden">
      <ForceGraph2D
        graphData={{ nodes, links }}
        nodeId="id"
        nodeVal="val"
        nodeColor="color"
        nodeLabel="name"
        linkColor={() => linkColor}
        backgroundColor={bg}
        onNodeClick={handleNodeClick as never}
        nodeCanvasObject={((node: GraphNode & { x?: number; y?: number }, ctx: CanvasRenderingContext2D, globalScale: number) => {
          const r = Math.sqrt(node.val) * 2.5
          const x = node.x ?? 0
          const y = node.y ?? 0

          ctx.beginPath()
          ctx.arc(x, y, r, 0, 2 * Math.PI)
          ctx.fillStyle = node.color
          ctx.fill()
          ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'
          ctx.lineWidth = 1
          ctx.stroke()

          const label = node.name
          const fontSize = Math.max(8, 12 / globalScale)
          ctx.font = `500 ${fontSize}px Inter, sans-serif`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'top'
          ctx.fillStyle = textColor
          ctx.fillText(label, x, y + r + 3)
        }) as never}
        cooldownTicks={100}
        width={undefined as never}
        height={undefined as never}
      />
    </div>
  )
}
