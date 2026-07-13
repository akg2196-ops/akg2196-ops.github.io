import { useState } from 'react'
import { useApp } from '../context'
import type { Role } from '../data'

function genRoleId() {
  return `r-${Math.random().toString(36).slice(2)}`
}

const emptyRole = (): Role => ({
  id: genRoleId(),
  title: '',
  url: '',
  track: 'Product',
  eligible: true,
})

type Props = { onClose: () => void }

export default function AddCompanyModal({ onClose }: Props) {
  const { addCompany } = useApp()
  const [name, setName] = useState('')
  const [tier, setTier] = useState<'S' | 'A'>('A')
  const [roles, setRoles] = useState<Role[]>([emptyRole()])
  const [deadline, setDeadline] = useState('')
  const [notes, setNotes] = useState('')

  const updateRole = (id: string, patch: Partial<Role>) => {
    setRoles((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }
  const removeRole = (id: string) => setRoles((rs) => rs.filter((r) => r.id !== id))

  const handleSave = () => {
    if (!name.trim()) return
    const cleanRoles = roles.filter((r) => r.title.trim())
    addCompany({
      name: name.trim(),
      tier,
      roles: cleanRoles.length ? cleanRoles : [],
      applicationDeadline: deadline.trim() || undefined,
      notes: notes.trim() || undefined,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
        className="relative border rounded-xl p-5 w-[480px] max-h-[80vh] overflow-y-auto shadow-xl z-10"
      >
        <h3 style={{ color: 'var(--text-primary)' }} className="text-[14px] font-semibold mb-4">
          Add Company
        </h3>

        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="field-label">Company name *</label>
              <input
                autoFocus
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Notion"
                className="field-input w-full"
              />
            </div>
            <div>
              <label className="field-label">Tier</label>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value as 'S' | 'A')}
                className="field-input"
              >
                <option value="S">S</option>
                <option value="A">A</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="field-label" style={{ marginBottom: 0 }}>Roles</label>
              <button
                onClick={() => setRoles((rs) => [...rs, emptyRole()])}
                className="text-[11px]"
                style={{ color: 'var(--text-secondary)' }}
              >
                + Add role
              </button>
            </div>
            <div className="space-y-2">
              {roles.map((r) => (
                <div key={r.id} style={{ borderColor: 'var(--border)' }} className="border rounded-lg p-2.5 space-y-2">
                  <input
                    type="text"
                    value={r.title}
                    onChange={(e) => updateRole(r.id, { title: e.target.value })}
                    placeholder="Role title"
                    className="field-input w-full"
                  />
                  <div className="flex gap-2 items-center">
                    <select
                      value={r.track}
                      onChange={(e) => updateRole(r.id, { track: e.target.value as Role['track'] })}
                      className="field-input"
                    >
                      <option value="Product">Product</option>
                      <option value="Growth">Growth</option>
                      <option value="Other">Other</option>
                    </select>
                    <label className="flex items-center gap-1.5 text-[11px] cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
                      <input
                        type="checkbox"
                        checked={r.eligible}
                        onChange={(e) => updateRole(r.id, { eligible: e.target.checked })}
                        className="rounded"
                      />
                      Eligible
                    </label>
                    <input
                      type="url"
                      value={r.url}
                      onChange={(e) => updateRole(r.id, { url: e.target.value })}
                      placeholder="Job URL"
                      className="field-input flex-1"
                    />
                    {roles.length > 1 && (
                      <button
                        onClick={() => removeRole(r.id)}
                        style={{ color: 'var(--text-secondary)' }}
                        className="text-[14px] leading-none hover:opacity-70"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="field-label">Application deadline</label>
            <input
              type="text"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              placeholder="e.g. Rolling, Jul 15 2026"
              className="field-input w-full"
            />
          </div>

          <div>
            <label className="field-label">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Anything relevant…"
              rows={3}
              className="field-input w-full resize-none"
            />
          </div>
        </div>

        <div className="flex gap-2 justify-end mt-5">
          <button onClick={onClose} className="btn-ghost text-[12px]">Cancel</button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="btn-primary text-[12px] disabled:opacity-40"
          >
            Add company
          </button>
        </div>
      </div>
    </div>
  )
}
