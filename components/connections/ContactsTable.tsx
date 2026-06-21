'use client'

import { useState, useEffect, useRef } from 'react'
import { format } from 'date-fns'
import { Plus, Linkedin, MessageSquare, Filter } from 'lucide-react'
import Link from 'next/link'
import type { Contact, Purpose } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { ContactDrawer } from './ContactDrawer'
import { AddContactModal } from './AddContactModal'
import { useOrbitStore } from '@/store/useOrbitStore'
import { cn } from '@/lib/utils'

function StrengthDots({ value }: { value: number }) {
  return (
    <span className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={cn(
            'w-1.5 h-1.5 rounded-full',
            i <= value ? 'bg-accent' : 'bg-neutral-200 dark:bg-neutral-700'
          )}
        />
      ))}
    </span>
  )
}

interface InlineCellProps {
  value: string
  onSave: (val: string) => void
  className?: string
  type?: string
}

function InlineCell({ value, onSave, className, type = 'text' }: InlineCellProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { if (editing) inputRef.current?.focus() }, [editing])
  useEffect(() => { setDraft(value) }, [value])

  const commit = () => {
    setEditing(false)
    if (draft !== value) onSave(draft)
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        type={type}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setEditing(false); setDraft(value) } }}
        className={cn(
          'w-full px-1 py-0.5 text-sm rounded-input bg-white dark:bg-neutral-800 border border-accent outline-none',
          className
        )}
      />
    )
  }

  return (
    <span
      onClick={() => setEditing(true)}
      className={cn('cursor-text hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded px-1 py-0.5 block truncate text-sm', className)}
    >
      {value || <span className="text-neutral-400">—</span>}
    </span>
  )
}

const PURPOSE_OPTIONS: Purpose[] = ['INVESTOR', 'MENTOR', 'PEER', 'RECRUIT', 'PARTNER', 'FOUNDER']

export function ContactsTable() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [filterPurpose, setFilterPurpose] = useState<string>('')
  const [filterStrength, setFilterStrength] = useState<string>('')
  const [search, setSearch] = useState('')
  const { addToast } = useOrbitStore()

  const fetchContacts = async () => {
    const params = new URLSearchParams()
    if (filterPurpose) params.set('purpose', filterPurpose)
    if (filterStrength) params.set('minStrength', filterStrength)
    if (search) params.set('search', search)
    const res = await fetch(`/api/contacts?${params}`)
    const data = await res.json()
    setContacts(data)
    setLoading(false)
  }

  useEffect(() => { fetchContacts() }, [filterPurpose, filterStrength, search])

  const updateContact = async (id: string, field: string, value: string) => {
    const res = await fetch(`/api/contacts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: field === 'strength' ? Number(value) : value }),
    })
    if (res.ok) {
      const updated = await res.json()
      setContacts((cs) => cs.map((c) => (c.id === id ? { ...c, ...updated } : c)))
      addToast('Saved')
    } else {
      addToast('Failed to save', 'error')
    }
  }

  const selected = contacts.find((c) => c.id === selectedId) || null

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-neutral-400 text-sm">
        Loading contacts…
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Filter bar */}
      <div className="flex items-center gap-3 px-6 py-3 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shrink-0">
        <Filter className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
        <input
          placeholder="Search by name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 px-3 text-xs rounded-input bg-neutral-100 dark:bg-neutral-800 border border-transparent focus:border-accent outline-none text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 w-48"
        />
        <select
          value={filterPurpose}
          onChange={(e) => setFilterPurpose(e.target.value)}
          className="h-7 px-2 text-xs rounded-input bg-neutral-100 dark:bg-neutral-800 border border-transparent text-neutral-700 dark:text-neutral-300 outline-none focus:border-accent"
        >
          <option value="">All purposes</option>
          {PURPOSE_OPTIONS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <select
          value={filterStrength}
          onChange={(e) => setFilterStrength(e.target.value)}
          className="h-7 px-2 text-xs rounded-input bg-neutral-100 dark:bg-neutral-800 border border-transparent text-neutral-700 dark:text-neutral-300 outline-none focus:border-accent"
        >
          <option value="">Min strength</option>
          {[1, 2, 3, 4, 5].map((s) => (
            <option key={s} value={s}>≥ {s}</option>
          ))}
        </select>
        <button
          onClick={() => setAddOpen(true)}
          className="ml-auto flex items-center gap-1.5 h-7 px-3 rounded-input bg-accent text-white text-xs font-medium hover:bg-indigo-500 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Contact
        </button>
      </div>

      {/* Table */}
      {contacts.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-3 text-neutral-400">
          <MessageSquare className="w-8 h-8" />
          <p className="text-sm">No contacts yet.</p>
          <button
            onClick={() => setAddOpen(true)}
            className="text-xs text-accent hover:underline"
          >
            Add your first contact
          </button>
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-xs text-neutral-500 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-800 sticky top-0 bg-neutral-50 dark:bg-neutral-950 z-10">
                <th className="text-left font-medium px-6 py-2">Name</th>
                <th className="text-left font-medium px-3 py-2">Company</th>
                <th className="text-left font-medium px-3 py-2">Role</th>
                <th className="text-left font-medium px-3 py-2">Last Contact</th>
                <th className="text-left font-medium px-3 py-2">Purpose</th>
                <th className="text-left font-medium px-3 py-2">Strength</th>
                <th className="text-left font-medium px-3 py-2">Notes</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className="border-b border-neutral-100 dark:border-neutral-800/60 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 cursor-pointer group"
                >
                  <td className="px-6 py-2 font-medium text-neutral-900 dark:text-neutral-100 min-w-[140px]" onClick={(e) => e.stopPropagation()}>
                    <InlineCell
                      value={c.name}
                      onSave={(v) => updateContact(c.id, 'name', v)}
                    />
                  </td>
                  <td className="px-3 py-2 min-w-[120px]" onClick={(e) => e.stopPropagation()}>
                    {c.company ? (
                      <Link
                        href={`/companies?id=${c.companyId}`}
                        className="text-accent hover:underline text-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {c.company.name}
                      </Link>
                    ) : (
                      <span className="text-neutral-400 text-sm">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2 min-w-[120px] text-neutral-600 dark:text-neutral-400" onClick={(e) => e.stopPropagation()}>
                    <InlineCell
                      value={c.role}
                      onSave={(v) => updateContact(c.id, 'role', v)}
                    />
                  </td>
                  <td className="px-3 py-2 font-mono text-xs text-neutral-500 whitespace-nowrap">
                    {format(new Date(c.lastContact), 'MMM d, yyyy')}
                  </td>
                  <td className="px-3 py-2">
                    <Badge value={c.purpose} variant="purpose" />
                  </td>
                  <td className="px-3 py-2">
                    <StrengthDots value={c.strength} />
                  </td>
                  <td className="px-3 py-2 font-mono text-xs text-neutral-400">
                    {c._count?.notes ?? 0}
                  </td>
                  <td className="px-3 py-2">
                    {c.linkedin && (
                      <a
                        href={c.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-neutral-400 hover:text-accent"
                      >
                        <Linkedin className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ContactDrawer
        contactId={selectedId}
        onClose={() => setSelectedId(null)}
        onUpdate={(updated) => setContacts((cs) => cs.map((c) => (c.id === updated.id ? { ...c, ...updated } : c)))}
      />

      <AddContactModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreated={(c) => { setContacts((cs) => [c, ...cs]); addToast('Contact added') }}
      />
    </div>
  )
}
