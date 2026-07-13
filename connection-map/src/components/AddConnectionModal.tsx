import { useState } from 'react'
import { useApp } from '../context'

type Props =
  | { forCompanyId: string; forPersonId?: never; onClose: () => void }
  | { forPersonId: string; forCompanyId?: never; onClose: () => void }

export default function AddConnectionModal({ forCompanyId, forPersonId, onClose }: Props) {
  const { data, addConnection } = useApp()
  const [otherId, setOtherId] = useState('')
  const [relationship, setRelationship] = useState('')

  const existingIds = new Set(
    forCompanyId
      ? data.connections.filter((c) => c.companyId === forCompanyId).map((c) => c.personId)
      : data.connections.filter((c) => c.personId === forPersonId).map((c) => c.companyId)
  )

  const options = forCompanyId
    ? data.people.filter((p) => !existingIds.has(p.id))
    : data.companies.filter((c) => !existingIds.has(c.id))

  const handleSave = () => {
    if (!otherId || !relationship.trim()) return
    if (forCompanyId) {
      addConnection({ companyId: forCompanyId, personId: otherId, relationship: relationship.trim() })
    } else {
      addConnection({ companyId: otherId, personId: forPersonId!, relationship: relationship.trim() })
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
        className="relative border rounded-xl p-5 w-[400px] shadow-xl z-10"
      >
        <h3 style={{ color: 'var(--text-primary)' }} className="text-[14px] font-semibold mb-4">
          Add Connection
        </h3>

        <div className="space-y-3">
          <div>
            <label className="field-label">
              {forCompanyId ? 'Person' : 'Company'}
            </label>
            <select
              value={otherId}
              onChange={(e) => setOtherId(e.target.value)}
              className="field-input w-full"
            >
              <option value="">Select…</option>
              {options.map((o) => (
                <option key={o.id} value={o.id}>
                  {'name' in o ? o.name : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="field-label">Relationship</label>
            <input
              type="text"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              placeholder="e.g. Knows the VP of Product"
              className="field-input w-full"
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
          </div>
        </div>

        <div className="flex gap-2 justify-end mt-5">
          <button onClick={onClose} className="btn-ghost text-[12px]">Cancel</button>
          <button
            onClick={handleSave}
            disabled={!otherId || !relationship.trim()}
            className="btn-primary text-[12px] disabled:opacity-40"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  )
}
