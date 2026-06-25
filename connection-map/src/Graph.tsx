import { useCallback, useMemo, useState } from 'react'
import {
  ReactFlow,
  Background,
  MiniMap,
  Controls,
  type Node,
  type Edge,
  type NodeMouseHandler,
  type EdgeMouseHandler,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  MarkerType,
} from '@xyflow/react'

import CompanyNode from './components/CompanyNode'
import PersonNode from './components/PersonNode'
import DetailPanel from './components/DetailPanel'

import {
  companies,
  people,
  connections,
  companyPositions,
  personPositions,
  type SelectedNode,
} from './data'

const nodeTypes = {
  company: CompanyNode,
  person: PersonNode,
}

function buildNodes(selectedCompanyId: string | null): Node[] {
  const companyNodes: Node[] = companies.map((c) => ({
    id: c.id,
    type: 'company',
    position: companyPositions[c.id] ?? { x: 0, y: 0 },
    data: {
      ...c,
      selected: selectedCompanyId === c.id,
      dimmed: selectedCompanyId !== null && selectedCompanyId !== c.id,
    },
  }))

  const connectedPeopleIds = selectedCompanyId
    ? new Set(
        connections
          .filter((cn) => cn.companyId === selectedCompanyId)
          .map((cn) => cn.personId)
      )
    : null

  const personNodes: Node[] = people.map((p) => ({
    id: p.id,
    type: 'person',
    position: personPositions[p.id] ?? { x: 0, y: 0 },
    data: {
      ...p,
      highlighted: connectedPeopleIds?.has(p.id) ?? false,
      dimmed: connectedPeopleIds !== null && !connectedPeopleIds.has(p.id),
    },
  }))

  return [...companyNodes, ...personNodes]
}

function buildEdges(selectedCompanyId: string | null, hoveredEdgeId: string | null): Edge[] {
  return connections.map((cn) => {
    const isActive = selectedCompanyId === cn.companyId
    const isHovered = hoveredEdgeId === cn.id
    const dimmed = selectedCompanyId !== null && !isActive

    return {
      id: cn.id,
      source: cn.personId,
      target: cn.companyId,
      label: isHovered || isActive ? cn.relationship : undefined,
      labelStyle: {
        fill: 'var(--text-secondary)',
        fontSize: 10,
        fontFamily: 'Inter, system-ui, sans-serif',
      },
      labelBgStyle: {
        fill: 'var(--surface)',
        fillOpacity: 0.9,
      },
      labelBgPadding: [4, 6] as [number, number],
      labelBgBorderRadius: 4,
      style: {
        stroke: isHovered || isActive ? 'var(--text-primary)' : 'var(--edge-color)',
        strokeWidth: isHovered || isActive ? 1.5 : 1,
        opacity: dimmed ? 0.15 : 1,
        transition: 'opacity 0.2s ease, stroke 0.15s ease',
      },
      markerEnd: {
        type: MarkerType.Arrow,
        width: 12,
        height: 12,
        color: isHovered || isActive ? 'var(--text-primary)' : 'var(--edge-color)',
      },
    }
  })
}

export default function Graph() {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null)
  const [hoveredEdgeId, setHoveredEdgeId] = useState<string | null>(null)
  const [detailNode, setDetailNode] = useState<SelectedNode | null>(null)

  const initialNodes = useMemo(() => buildNodes(null), [])
  const initialEdges = useMemo(() => buildEdges(null, null), [])

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const refresh = useCallback(
    (companyId: string | null, edgeId: string | null) => {
      setNodes(buildNodes(companyId))
      setEdges(buildEdges(companyId, edgeId))
    },
    [setNodes, setEdges]
  )

  const onNodeClick: NodeMouseHandler = useCallback(
    (_e, node) => {
      if (node.type === 'company') {
        const company = companies.find((c) => c.id === node.id)
        if (!company) return

        const isAlreadySelected = selectedCompanyId === node.id
        const nextId = isAlreadySelected ? null : node.id
        setSelectedCompanyId(nextId)
        refresh(nextId, hoveredEdgeId)

        if (isAlreadySelected) {
          setDetailNode(null)
        } else {
          setDetailNode({ kind: 'company', data: company })
        }
      } else if (node.type === 'person') {
        const person = people.find((p) => p.id === node.id)
        if (!person) return
        setDetailNode({ kind: 'person', data: person })
      }
    },
    [selectedCompanyId, hoveredEdgeId, refresh]
  )

  const onPaneClick = useCallback(() => {
    setSelectedCompanyId(null)
    setDetailNode(null)
    refresh(null, hoveredEdgeId)
  }, [hoveredEdgeId, refresh])

  const onEdgeMouseEnter: EdgeMouseHandler = useCallback(
    (_e, edge) => {
      setHoveredEdgeId(edge.id)
      refresh(selectedCompanyId, edge.id)
    },
    [selectedCompanyId, refresh]
  )

  const onEdgeMouseLeave: EdgeMouseHandler = useCallback(
    (_e, _edge) => {
      setHoveredEdgeId(null)
      refresh(selectedCompanyId, null)
    },
    [selectedCompanyId, refresh]
  )

  return (
    <div className="w-full h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onEdgeMouseEnter={onEdgeMouseEnter}
        onEdgeMouseLeave={onEdgeMouseLeave}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.3}
        maxZoom={2}
        defaultEdgeOptions={{ type: 'smoothstep' }}
        edgesFocusable={true}
        elementsSelectable={true}
        nodesConnectable={false}
        nodesDraggable={true}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="var(--border)" />
        <MiniMap
          nodeColor={() => 'var(--surface)'}
          nodeStrokeColor={() => 'var(--border)'}
          maskColor="rgba(0,0,0,0.12)"
          position="bottom-left"
        />
        <Controls position="bottom-right" showInteractive={false} />
      </ReactFlow>

      <DetailPanel node={detailNode} onClose={() => setDetailNode(null)} />
    </div>
  )
}
