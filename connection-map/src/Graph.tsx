import { useCallback, useEffect, useRef } from 'react'
import {
  ReactFlow,
  Background,
  MiniMap,
  Controls,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type NodeMouseHandler,
  type EdgeMouseHandler,
  type NodeChange,
  type XYPosition,
} from '@xyflow/react'

import CompanyNode from './components/CompanyNode'
import PersonNode from './components/PersonNode'

import { defaultPositions, type AppData, type Selection } from './data'
import { useApp } from './context'
import { useState } from 'react'

const nodeTypes = { company: CompanyNode, person: PersonNode }

// ── Graph state builders ────────────────────────────────────────────────────

function buildNodes(
  data: AppData,
  sel: Selection | null,
  positions: Record<string, XYPosition>,
  searchQuery: string,
): Node[] {
  const selId = sel?.id ?? null
  const selKind = sel?.kind ?? null
  const q = searchQuery.trim().toLowerCase()

  const connectedToSelected = new Set<string>()
  if (selId) {
    data.connections.forEach((c) => {
      if (selKind === 'company' && c.companyId === selId) connectedToSelected.add(c.personId)
      if (selKind === 'person' && c.personId === selId) connectedToSelected.add(c.companyId)
    })
  }

  const companyNodes: Node[] = data.companies.map((c) => {
    const selected = selId === c.id
    const highlighted = !selected && selId !== null && connectedToSelected.has(c.id)
    let dimmed = selId !== null && !selected && !highlighted
    if (q && !dimmed) {
      const matches =
        c.name.toLowerCase().includes(q) ||
        c.roles.some((r) => r.title.toLowerCase().includes(q))
      if (!matches) dimmed = true
    }
    return {
      id: c.id,
      type: 'company',
      position: positions[c.id] ?? defaultPositions[c.id] ?? { x: 0, y: 60 },
      data: { ...c, selected, dimmed },
    }
  })

  const personNodes: Node[] = data.people.map((p) => {
    const selected = selId === p.id
    const highlighted = !selected && selId !== null && connectedToSelected.has(p.id)
    let dimmed = selId !== null && !selected && !highlighted
    if (q && !dimmed) {
      const matches =
        p.name.toLowerCase().includes(q) ||
        (p.currentCompany?.toLowerCase().includes(q) ?? false) ||
        (p.role?.toLowerCase().includes(q) ?? false)
      if (!matches) dimmed = true
    }
    return {
      id: p.id,
      type: 'person',
      position: positions[p.id] ?? defaultPositions[p.id] ?? { x: 0, y: 560 },
      data: { ...p, selected, highlighted, dimmed },
    }
  })

  return [...companyNodes, ...personNodes]
}

function buildEdges(data: AppData, sel: Selection | null, hoveredId: string | null): Edge[] {
  const selId = sel?.id ?? null
  const selKind = sel?.kind ?? null

  return data.connections.map((conn) => {
    const isRelatedToSel =
      selId !== null &&
      ((selKind === 'company' && conn.companyId === selId) ||
        (selKind === 'person' && conn.personId === selId))

    const isHovered = hoveredId === conn.id
    const active = isRelatedToSel || isHovered
    const dimmed = selId !== null && !active

    return {
      id: conn.id,
      source: conn.personId,
      target: conn.companyId,
      type: 'smoothstep',
      label: isHovered || isRelatedToSel ? conn.relationship : undefined,
      labelStyle: {
        fill: 'var(--text-secondary)',
        fontSize: 10,
        fontFamily: 'Inter, system-ui, sans-serif',
      },
      labelBgStyle: { fill: 'var(--surface)', fillOpacity: 0.92 },
      labelBgPadding: [5, 7] as [number, number],
      labelBgBorderRadius: 4,
      style: {
        stroke: active ? 'var(--text-primary)' : 'var(--edge-color)',
        strokeWidth: active ? 1.5 : 1,
        opacity: dimmed ? 0.1 : 1,
        transition: 'opacity 0.2s ease',
      },
    }
  })
}

// ── Graph component ─────────────────────────────────────────────────────────

type Props = {
  selection: Selection | null
  onSelectionChange: (s: Selection | null) => void
  searchQuery: string
}

export default function Graph({ selection, onSelectionChange, searchQuery }: Props) {
  const { data } = useApp()

  const [hoveredEdgeId, setHoveredEdgeId] = useState<string | null>(null)

  const positionsRef = useRef<Record<string, XYPosition>>({})

  const [rfNodes, setRfNodes, onRfNodesChange] = useNodesState<Node>([])
  const [rfEdges, setRfEdges, onRfEdgesChange] = useEdgesState<Edge>([])

  // Rebuild nodes/edges whenever data, selection, hover, or search changes
  useEffect(() => {
    setRfNodes(buildNodes(data, selection, positionsRef.current, searchQuery))
    setRfEdges(buildEdges(data, selection, hoveredEdgeId))
  }, [data, selection, hoveredEdgeId, searchQuery]) // eslint-disable-line

  // Track dragged positions
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      onRfNodesChange(changes)
      changes.forEach((ch) => {
        if (ch.type === 'position' && ch.position) {
          positionsRef.current[ch.id] = ch.position
        }
      })
    },
    [onRfNodesChange]
  )

  const onNodeClick: NodeMouseHandler = useCallback(
    (_e, node) => {
      const kind = node.type === 'company' ? 'company' : 'person'
      onSelectionChange(
        selection?.id === node.id ? null : { kind, id: node.id }
      )
    },
    [selection, onSelectionChange]
  )

  const onPaneClick = useCallback(() => {
    onSelectionChange(null)
    setHoveredEdgeId(null)
  }, [onSelectionChange])

  const onEdgeMouseEnter: EdgeMouseHandler = useCallback((_e, edge) => {
    setHoveredEdgeId(edge.id)
  }, [])

  const onEdgeMouseLeave: EdgeMouseHandler = useCallback(() => {
    setHoveredEdgeId(null)
  }, [])

  return (
    <div className="w-full h-full relative">
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onRfEdgesChange}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onEdgeMouseEnter={onEdgeMouseEnter}
        onEdgeMouseLeave={onEdgeMouseLeave}
        fitView
        fitViewOptions={{ padding: 0.12 }}
        minZoom={0.2}
        maxZoom={2}
        nodesConnectable={false}
        edgesFocusable
        elementsSelectable
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="var(--border)" />
        <MiniMap
          nodeColor={() => 'var(--surface)'}
          nodeStrokeColor={() => 'var(--border)'}
          maskColor="rgba(0,0,0,0.1)"
          position="bottom-left"
        />
        <Controls position="bottom-right" showInteractive={false} />
      </ReactFlow>
    </div>
  )
}
