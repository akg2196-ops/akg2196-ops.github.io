'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Modal } from '@/components/ui/Modal'
import type { Contact, Purpose } from '@/types'

const PURPOSE_OPTIONS: Purpose[] = ['INVESTOR', 'MENTOR', 'PEER', 'RECRUIT', 'PARTNER', 'FOUNDER']

interface AddContactModalProps {
  open: boolean
  onClose: () => void
  onCreated: (c: Contact) => void
}

export function AddContactModal({ open, onClose, onCreated }: AddContactModalProps) {
  const [form, setForm] = useState({
    name: '',
    role: '',
    email: '',
    linkedin: '',
    purpose: 'PEER' as Purpose,
    strength: 3,
    lastContact: format(new Date(), 'yyyy-MM-dd'),
    tags: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const set = (k: string, v: string | number) => setForm((f) => ({ ...f, [k]: v }))

  const handleCreate = async () => {
    if (!form.name.trim()) { setError('Name is required'); return }
    setSaving(true)
    setError('')
    const res = await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        strength: Number(form.strength),
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      }),
    })
    if (res.ok) {
      const contact = await res.json()
      onCreated(contact)
      onClose()
      setForm({ name: '', role: '', email: '', linkedin: '', purpose: 'PEER', strength: 3, lastContact: format(new Date(), 'yyyy-MM-dd'), tags: '' })
    } else {
      setError('Failed to create contact')
    }
    setSaving(false)
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Contact">
      <div className="space-y-4">
        {error && <p className="text-xs text-red-500">{error}</p>}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-neutral-500 mb-1">Name *</label>
            <input
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              className="w-full h-8 px-3 text-sm rounded-input bg-neutral-100 dark:bg-neutral-800 border border-transparent focus:border-accent outline-none text-neutral-900 dark:text-neutral-100"
              placeholder="Full name"
            />
          </div>
          <div>
            <label className="block text-xs text-neutral-500 mb-1">Role</label>
            <input
              value={form.role}
              onChange={(e) => set('role', e.target.value)}
              className="w-full h-8 px-3 text-sm rounded-input bg-neutral-100 dark:bg-neutral-800 border border-transparent focus:border-accent outline-none text-neutral-900 dark:text-neutral-100"
              placeholder="Title / role"
            />
          </div>
          <div>
            <label className="block text-xs text-neutral-500 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              className="w-full h-8 px-3 text-sm rounded-input bg-neutral-100 dark:bg-neutral-800 border border-transparent focus:border-accent outline-none text-neutral-900 dark:text-neutral-100"
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label className="block text-xs text-neutral-500 mb-1">LinkedIn URL</label>
            <input
              value={form.linkedin}
              onChange={(e) => set('linkedin', e.target.value)}
              className="w-full h-8 px-3 text-sm rounded-input bg-neutral-100 dark:bg-neutral-800 border border-transparent focus:border-accent outline-none text-neutral-900 dark:text-neutral-100"
              placeholder="https://linkedin.com/in/..."
            />
          </div>
          <div>
            <label className="block text-xs text-neutral-500 mb-1">Purpose</label>
            <select
              value={form.purpose}
              onChange={(e) => set('purpose', e.target.value)}
              className="w-full h-8 px-2 text-sm rounded-input bg-neutral-100 dark:bg-neutral-800 border border-transparent focus:border-accent outline-none text-neutral-700 dark:text-neutral-300"
            >
              {PURPOSE_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-neutral-500 mb-1">Strength (1–5)</label>
            <input
              type="number"
              min={1}
              max={5}
              value={form.strength}
              onChange={(e) => set('strength', Number(e.target.value))}
              className="w-full h-8 px-3 text-sm rounded-input bg-neutral-100 dark:bg-neutral-800 border border-transparent focus:border-accent outline-none text-neutral-900 dark:text-neutral-100"
            />
          </div>
          <div>
            <label className="block text-xs text-neutral-500 mb-1">Last Contact</label>
            <input
              type="date"
              value={form.lastContact}
              onChange={(e) => set('lastContact', e.target.value)}
              className="w-full h-8 px-3 text-sm rounded-input bg-neutral-100 dark:bg-neutral-800 border border-transparent focus:border-accent outline-none text-neutral-700 dark:text-neutral-300"
            />
          </div>
          <div>
            <label className="block text-xs text-neutral-500 mb-1">Tags (comma-separated)</label>
            <input
              value={form.tags}
              onChange={(e) => set('tags', e.target.value)}
              className="w-full h-8 px-3 text-sm rounded-input bg-neutral-100 dark:bg-neutral-800 border border-transparent focus:border-accent outline-none text-neutral-900 dark:text-neutral-100"
              placeholder="ai, vc, alumni"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="h-8 px-4 text-sm rounded-input bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={saving}
            className="h-8 px-4 text-sm rounded-input bg-accent text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving…' : 'Create'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
