'use client'

import { useEffect, useState } from 'react'
import { Linkedin, UserPlus, Check } from 'lucide-react'
import Link from 'next/link'
import type { Exec } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { useOrbitStore } from '@/store/useOrbitStore'
import { format } from 'date-fns'

export function ExecCards() {
  const [execs, setExecs] = useState<Exec[]>([])
  const [loading, setLoading] = useState(true)
  const [added, setAdded] = useState<Set<string>>(new Set())
  const { addToast } = useOrbitStore()

  useEffect(() => {
    fetch('/api/execs')
      .then((r) => r.json())
      .then((data) => { setExecs(data); setLoading(false) })
  }, [])

  const addToConnections = async (exec: Exec) => {
    const res = await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: exec.name,
        role: exec.title,
        companyId: exec.companyId,
        purpose: 'PARTNER',
        strength: 1,
        lastContact: format(new Date(), 'yyyy-MM-dd'),
        linkedin: exec.linkedin,
        tags: [],
      }),
    })
    if (res.ok) {
      setAdded((s) => new Set(s).add(exec.id))
      addToast(`${exec.name} added to Connections`)
    } else {
      addToast('Failed to add contact', 'error')
    }
  }

  if (loading) {
    return <div className="text-neutral-400 text-sm py-8 text-center">Loading…</div>
  }

  if (execs.length === 0) {
    return (
      <div className="text-center py-8 text-neutral-400">
        <p className="text-sm">No execs found. Add companies to your watchlist first.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {execs.map((exec) => (
        <div
          key={exec.id}
          className="rounded-card border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 flex flex-col gap-3"
        >
          {/* Avatar */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-semibold text-sm shrink-0">
              {exec.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 truncate">{exec.name}</p>
              <p className="text-xs text-neutral-500 truncate">{exec.title}</p>
            </div>
          </div>

          {/* Company */}
          {exec.company && (
            <Link
              href={`/companies?id=${exec.companyId}`}
              className="text-xs text-accent hover:underline"
            >
              {exec.company.name}
            </Link>
          )}

          {/* Relevance */}
          <div className="flex items-center gap-2">
            <Badge value={exec.relevance} variant="relevance" />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-auto">
            {exec.linkedin && (
              <a
                href={exec.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-accent transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5" />
                LinkedIn
              </a>
            )}
            <button
              onClick={() => addToConnections(exec)}
              disabled={added.has(exec.id)}
              className="ml-auto flex items-center gap-1.5 h-7 px-3 rounded-input text-xs font-medium transition-colors
                         disabled:opacity-50
                         bg-accent/10 text-accent hover:bg-accent hover:text-white dark:bg-accent/20"
            >
              {added.has(exec.id) ? (
                <><Check className="w-3 h-3" /> Added</>
              ) : (
                <><UserPlus className="w-3 h-3" /> Add to Connections</>
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
