import { useState } from 'react'
import { useApp } from '../context'

type Props = { onClose: () => void }

export default function AddPersonModal({ onClose }: Props) {
  const { addPerson } = useApp()
  const [name, setName] = useState('')
  const [currentCompany, setCurrentCompany] = useState('')
  const [role, setRole] = useState('')
  const [prevCompanies, setPrevCompanies] = useState<[string, string]>(['', ''])
  const [university, setUniversity] = useState('')
  const [howWeMet, setHowWeMet] = useState('')
  const [backlinks, setBacklinks] = useState<{ label: string; url: string }[]>([])

  const addBacklink = () => setBacklinks((bl) => [...bl, { label: '', url: '' }])
  const updateBacklink = (i: number, patch: Partial<{ label: string; url: string }>) => {
    setBacklinks((bl) => bl.map((b, idx) => (idx === i ? { ...b, ...patch } : b)))
  }
  const removeBacklink = (i: number) => setBacklinks((bl) => bl.filter((_, idx) => idx !== i))

  const handleSave = () => {
    if (!name.trim()) return
    addPerson({
      name: name.trim(),
      currentCompany: currentCompany.trim() || undefined,
      role: role.trim() || undefined,
      previousCompanies: prevCompanies.filter(Boolean),
      university: university.trim() || undefined,
      howWeMet: howWeMet.trim() || undefined,
      backlinks: backlinks.filter((b) => b.label.trim() && b.url.trim()),
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
          Add Person
        </h3>

        <div className="space-y-3">
          <div>
            <label className="field-label">Name *</label>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="field-input w-full"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="field-label">Current company</label>
              <input
                type="text"
                value={currentCompany}
                onChange={(e) => setCurrentCompany(e.target.value)}
                placeholder="e.g. Stripe"
                className="field-input w-full"
              />
            </div>
            <div className="flex-1">
              <label className="field-label">Role / title</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Product Manager"
                className="field-input w-full"
              />
            </div>
          </div>

          <div>
            <label className="field-label">Previous companies (max 2)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={prevCompanies[0]}
                onChange={(e) => setPrevCompanies([e.target.value, prevCompanies[1]])}
                placeholder="Previous 1"
                className="field-input flex-1"
              />
              <input
                type="text"
                value={prevCompanies[1]}
                onChange={(e) => setPrevCompanies([prevCompanies[0], e.target.value])}
                placeholder="Previous 2"
                className="field-input flex-1"
              />
            </div>
          </div>

          <div>
            <label className="field-label">University</label>
            <input
              type="text"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              placeholder="e.g. Columbia"
              className="field-input w-full"
            />
          </div>

          <div>
            <label className="field-label">How we met</label>
            <textarea
              value={howWeMet}
              onChange={(e) => setHowWeMet(e.target.value)}
              placeholder="Context on how you know this person…"
              rows={2}
              className="field-input w-full resize-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="field-label" style={{ marginBottom: 0 }}>Links</label>
              <button
                onClick={addBacklink}
                style={{ color: 'var(--text-secondary)' }}
                className="text-[11px] hover:opacity-70"
              >
                + Add link
              </button>
            </div>
            <div className="space-y-2">
              {backlinks.map((b, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={b.label}
                    onChange={(e) => updateBacklink(i, { label: e.target.value })}
                    placeholder="Label"
                    className="field-input w-24"
                  />
                  <input
                    type="url"
                    value={b.url}
                    onChange={(e) => updateBacklink(i, { url: e.target.value })}
                    placeholder="https://…"
                    className="field-input flex-1"
                  />
                  <button
                    onClick={() => removeBacklink(i)}
                    style={{ color: 'var(--text-secondary)' }}
                    className="text-[14px] leading-none hover:opacity-70"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2 justify-end mt-5">
          <button onClick={onClose} className="btn-ghost text-[12px]">Cancel</button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="btn-primary text-[12px] disabled:opacity-40"
          >
            Add person
          </button>
        </div>
      </div>
    </div>
  )
}
