'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Linkedin, Mail, Plus, Building2 } from 'lucide-react'
import type { Contact, Note } from '@/types'
import { Drawer } from '@/components/ui/Drawer'
import { Badge } from '@/components/ui/Badge'
import { useOrbitStore } from '@/store/useOrbitStore'
import Link from 'next/link'

interface ContactDrawerProps {
  contactId: string | null
  onClose: () => void
  onUpdate: (c: Contact) => void
}

function StrengthPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          className={`w-5 h-5 rounded-full border-2 transition-colors ${
            i <= value
              ? 'bg-accent border-accent'
              : 'bg-transparent border-neutral-300 dark:border-neutral-700 hover:border-accent'
          }`}
        />
      ))}
    </div>
  )
}

export function ContactDrawer({ contactId, onClose, onUpdate }: ContactDrawerProps) {
  const [contact, setContact] = useState<Contact | null>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [noteBody, setNoteBody] = useState('')
  const [notePurpose, setNotePurpose] = useState('')
  const [noteDate, setNoteDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [saving, setSaving] = useState(false)
  const { addToast } = useOrbitStore()

  useEffect(() => {
    if (!contactId) { setContact(null); setNotes([]); return }
    fetch(`/api/contacts/${contactId}`)
      .then((r) => r.json())
      .then((data) => { setContact(data); setNotes(data.notes || []) })
  }, [contactId])

  const updateField = async (field: string, value: string | number) => {
    if (!contact) return
    const res = await fetch(`/api/contacts/${contact.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: value }),
    })
    if (res.ok) {
      const updated = await res.json()
      setContact(updated)
      onUpdate(updated)
      addToast('Saved')
    }
  }

  const addNote = async () => {
    if (!contact || !noteBody.trim()) return
    setSaving(true)
    const res = await fetch(`/api/contacts/${contact.id}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: noteBody, meetingDate: noteDate, purpose: notePurpose }),
    })
    if (res.ok) {
      const note = await res.json()
      setNotes((ns) => [note, ...ns])
      setNoteBody('')
      setNotePurpose('')
      addToast('Note added')
    }
    setSaving(false)
  }

  return (
    <Drawer open={!!contactId} onClose={onClose} title={contact?.name ?? 'Contact'}>
      {!contact ? (
        <div className="flex items-center justify-center h-32 text-neutral-400 text-sm">Loading…</div>
      ) : (
        <div className="p-5 space-y-6">
          {/* Header */}
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-semibold text-sm">
                {contact.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <p className="font-semibold text-neutral-900 dark:text-neutral-100">{contact.name}</p>
                <p className="text-xs text-neutral-500">{contact.role}</p>
              </div>
            </div>
          </div>

          {/* Meta */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            {contact.company && (
              <div>
                <p className="text-neutral-400 mb-1">Company</p>
                <Link href={`/companies?id=${contact.companyId}`} className="flex items-center gap-1.5 text-accent hover:underline">
                  <Building2 className="w-3 h-3" />
                  {contact.company.name}
                </Link>
              </div>
            )}
            <div>
              <p className="text-neutral-400 mb-1">Purpose</p>
              <Badge value={contact.purpose} variant="purpose" />
            </div>
            <div>
              <p className="text-neutral-400 mb-1">Strength</p>
              <StrengthPicker value={contact.strength} onChange={(v) => updateField('strength', v)} />
            </div>
            <div>
              <p className="text-neutral-400 mb-1">Last Contact</p>
              <input
                type="date"
                defaultValue={format(new Date(contact.lastContact), 'yyyy-MM-dd')}
                onBlur={(e) => updateField('lastContact', e.target.value)}
                className="bg-neutral-100 dark:bg-neutral-800 border border-transparent focus:border-accent rounded-input px-2 py-1 text-xs outline-none text-neutral-700 dark:text-neutral-300"
              />
            </div>
          </div>

          {/* Links */}
          <div className="flex gap-3">
            {contact.email && (
              <a href={`mailto:${contact.email}`} className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-accent transition-colors">
                <Mail className="w-3.5 h-3.5" />
                {contact.email}
              </a>
            )}
            {contact.linkedin && (
              <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-accent transition-colors">
                <Linkedin className="w-3.5 h-3.5" />
                LinkedIn
              </a>
            )}
          </div>

          {/* Tags */}
          {contact.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {contact.tags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-xs font-mono rounded">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Add note */}
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-card p-3 space-y-2">
            <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400">Add Note</p>
            <textarea
              value={noteBody}
              onChange={(e) => setNoteBody(e.target.value)}
              placeholder="What happened, what was said, next steps…"
              rows={3}
              className="w-full text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-input px-3 py-2 outline-none focus:border-accent resize-none text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400"
            />
            <div className="flex gap-2">
              <input
                type="date"
                value={noteDate}
                onChange={(e) => setNoteDate(e.target.value)}
                className="flex-1 text-xs bg-neutral-100 dark:bg-neutral-800 border border-transparent focus:border-accent rounded-input px-2 py-1.5 outline-none text-neutral-700 dark:text-neutral-300"
              />
              <input
                value={notePurpose}
                onChange={(e) => setNotePurpose(e.target.value)}
                placeholder="Meeting type"
                className="flex-1 text-xs bg-neutral-100 dark:bg-neutral-800 border border-transparent focus:border-accent rounded-input px-2 py-1.5 outline-none text-neutral-700 dark:text-neutral-300 placeholder:text-neutral-400"
              />
              <button
                onClick={addNote}
                disabled={saving || !noteBody.trim()}
                className="flex items-center gap-1 px-3 py-1.5 bg-accent text-white text-xs rounded-input hover:bg-indigo-500 disabled:opacity-50 transition-colors"
              >
                <Plus className="w-3 h-3" />
                Add
              </button>
            </div>
          </div>

          {/* Notes list */}
          <div className="space-y-3">
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
              Conversation Log ({notes.length})
            </p>
            {notes.length === 0 ? (
              <p className="text-sm text-neutral-400">No notes yet. Add your first one above.</p>
            ) : (
              notes.map((note) => (
                <div key={note.id} className="border border-neutral-200 dark:border-neutral-800 rounded-card p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-neutral-400">
                      {format(new Date(note.meetingDate), 'MMM d, yyyy')}
                    </span>
                    {note.purpose && (
                      <span className="text-xs text-neutral-400 italic">{note.purpose}</span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap">
                    {note.body}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </Drawer>
  )
}
