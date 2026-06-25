import { useEffect, useState } from 'react'
import { useApp } from '../context'
import type { Role } from '../data'
import AddConnectionModal from './AddConnectionModal'
import ConfirmDialog from './ConfirmDialog'

type Selection =
  | { kind: 'company'; id: string }
  | { kind: 'person'; id: string }

type Props = {
  selection: Selection | null
  onClose: () => void
  onDeleted: () => void
}

export default function SidePanel({ selection, onClose, onDeleted }: Props) {
  if (!selection) return null
  return selection.kind === 'company'
    ? <CompanyPanel id={selection.id} onClose={onClose} onDeleted={onDeleted} />
    : <PersonPanel id={selection.id} onClose={onClose} onDeleted={onDeleted} />
}

// ── Shared shell ────────────────────────────────────────────────────────────

function Shell({ label, children, onClose }: { label: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
      className="fixed right-0 top-0 h-full w-[360px] z-50 border-l shadow-xl overflow-y-auto flex flex-col"
    >
      <div
        style={{ borderBottomColor: 'var(--border)' }}
        className="flex items-center justify-between px-5 py-3.5 border-b shrink-0"
      >
        <span style={{ color: 'var(--text-secondary)' }} className="text-[10px] uppercase tracking-widest font-medium">
          {label}
        </span>
        <button
          onClick={onClose}
          style={{ color: 'var(--text-secondary)' }}
          className="text-[18px] leading-none hover:opacity-70 transition-opacity"
        >
          ×
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">{children}</div>
    </div>
  )
}

// ── Company panel ───────────────────────────────────────────────────────────

function genRoleId() {
  return `r-${Math.random().toString(36).slice(2)}`
}

function CompanyPanel({ id, onClose, onDeleted }: { id: string; onClose: () => void; onDeleted: () => void }) {
  const { data, updateCompany, deleteCompany, deleteConnection } = useApp()
  const company = data.companies.find((c) => c.id === id)

  const [editMode, setEditMode] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [showAddConn, setShowAddConn] = useState(false)

  // Edit form state
  const [eName, setEName] = useState('')
  const [eTier, setETier] = useState<'S' | 'A'>('A')
  const [eRoles, setERoles] = useState<Role[]>([])
  const [eDeadline, setEDeadline] = useState('')
  const [eNotes, setENotes] = useState('')

  const enterEdit = () => {
    if (!company) return
    setEName(company.name)
    setETier(company.tier)
    setERoles(company.roles.map((r) => ({ ...r })))
    setEDeadline(company.applicationDeadline ?? '')
    setENotes(company.notes ?? '')
    setEditMode(true)
  }

  const cancelEdit = () => setEditMode(false)

  const saveEdit = () => {
    if (!company || !eName.trim()) return
    updateCompany({
      ...company,
      name: eName.trim(),
      tier: eTier,
      roles: eRoles.filter((r) => r.title.trim()),
      applicationDeadline: eDeadline.trim() || undefined,
      notes: eNotes.trim() || undefined,
    })
    setEditMode(false)
  }

  const updateRole = (rid: string, patch: Partial<Role>) =>
    setERoles((rs) => rs.map((r) => (r.id === rid ? { ...r, ...patch } : r)))
  const removeRole = (rid: string) => setERoles((rs) => rs.filter((r) => r.id !== rid))
  const addRole = () => setERoles((rs) => [...rs, { id: genRoleId(), title: '', url: '', track: 'Product', eligible: true }])

  // Reset edit mode when selection changes
  useEffect(() => { setEditMode(false) }, [id])

  if (!company) return null

  const connections = data.connections.filter((c) => c.companyId === id)

  return (
    <Shell label="Company" onClose={onClose}>
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        {editMode ? (
          <div className="flex gap-2 flex-1">
            <input
              autoFocus
              value={eName}
              onChange={(e) => setEName(e.target.value)}
              className="field-input flex-1 text-[15px] font-semibold"
            />
            <select value={eTier} onChange={(e) => setETier(e.target.value as 'S' | 'A')} className="field-input">
              <option value="S">S</option>
              <option value="A">A</option>
            </select>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2">
              <h2 style={{ color: 'var(--text-primary)' }} className="text-[17px] font-semibold tracking-tight">
                {company.name}
              </h2>
              <TierBadge tier={company.tier} />
            </div>
          </div>
        )}

        {!editMode && (
          <div className="flex gap-1 shrink-0">
            <button onClick={enterEdit} className="btn-ghost text-[11px]">Edit</button>
            <button onClick={() => setShowDelete(true)} className="btn-ghost text-[11px]" style={{ color: '#dc2626' }}>
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Roles */}
      <Section label="Roles">
        {editMode ? (
          <div className="space-y-2">
            {eRoles.map((r) => (
              <div key={r.id} style={{ borderColor: 'var(--border)' }} className="border rounded-lg p-2.5 space-y-2">
                <input
                  type="text"
                  value={r.title}
                  onChange={(e) => updateRole(r.id, { title: e.target.value })}
                  placeholder="Role title"
                  className="field-input w-full"
                />
                <div className="flex gap-2 items-center flex-wrap">
                  <select
                    value={r.track}
                    onChange={(e) => updateRole(r.id, { track: e.target.value as Role['track'] })}
                    className="field-input"
                  >
                    <option>Product</option>
                    <option>Growth</option>
                    <option>Other</option>
                  </select>
                  <label className="flex items-center gap-1.5 text-[11px] cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
                    <input
                      type="checkbox"
                      checked={r.eligible}
                      onChange={(e) => updateRole(r.id, { eligible: e.target.checked })}
                    />
                    Eligible
                  </label>
                  <input
                    type="url"
                    value={r.url ?? ''}
                    onChange={(e) => updateRole(r.id, { url: e.target.value })}
                    placeholder="URL"
                    className="field-input flex-1 min-w-0"
                  />
                  {eRoles.length > 0 && (
                    <button onClick={() => removeRole(r.id)} style={{ color: 'var(--text-secondary)' }} className="text-[14px]">×</button>
                  )}
                </div>
              </div>
            ))}
            <button onClick={addRole} style={{ color: 'var(--text-secondary)' }} className="text-[11px] hover:opacity-70">
              + Add role
            </button>
          </div>
        ) : (
          <div className="space-y-1.5">
            {company.roles.length === 0 ? (
              <Empty>No roles added</Empty>
            ) : (
              company.roles.map((r) => (
                <div key={r.id} style={{ borderColor: 'var(--border)' }} className="border rounded-lg p-2.5">
                  <div className="flex items-start justify-between gap-2">
                    {r.url ? (
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--text-primary)' }}
                        className="text-[12px] font-medium hover:underline leading-snug"
                      >
                        {r.title} ↗
                      </a>
                    ) : (
                      <span style={{ color: 'var(--text-primary)' }} className="text-[12px] font-medium leading-snug">
                        {r.title}
                      </span>
                    )}
                    <div className="flex gap-1 shrink-0 flex-wrap justify-end">
                      <Tag label={r.track} />
                      {r.eligible && <Tag label="Eligible" />}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </Section>

      {/* Deadline */}
      {(editMode || company.applicationDeadline) && (
        <Section label="Deadline">
          {editMode ? (
            <input
              type="text"
              value={eDeadline}
              onChange={(e) => setEDeadline(e.target.value)}
              placeholder="e.g. Rolling, Jul 15"
              className="field-input w-full"
            />
          ) : (
            <p style={{ color: 'var(--text-secondary)' }} className="text-[12px]">
              {company.applicationDeadline}
            </p>
          )}
        </Section>
      )}

      {/* Notes */}
      {(editMode || company.notes) && (
        <Section label="Notes">
          {editMode ? (
            <textarea
              value={eNotes}
              onChange={(e) => setENotes(e.target.value)}
              rows={3}
              className="field-input w-full resize-none"
            />
          ) : (
            <p style={{ color: 'var(--text-secondary)' }} className="text-[12px] leading-relaxed">
              {company.notes}
            </p>
          )}
        </Section>
      )}

      {/* Connections */}
      <Section label={`Connections (${connections.length})`}>
        <div className="space-y-1.5">
          {connections.length === 0 ? (
            <Empty>No people connected yet</Empty>
          ) : (
            connections.map((conn) => {
              const person = data.people.find((p) => p.id === conn.personId)
              return (
                <ConnectionRow
                  key={conn.id}
                  label={person?.name ?? 'Unknown'}
                  sublabel={conn.relationship}
                  onDelete={() => deleteConnection(conn.id)}
                  editMode={editMode}
                />
              )
            })
          )}
        </div>
        {!editMode && (
          <button
            onClick={() => setShowAddConn(true)}
            style={{ color: 'var(--text-secondary)' }}
            className="text-[11px] mt-2 hover:opacity-70"
          >
            + Add connection
          </button>
        )}
      </Section>

      {/* Save/cancel in edit mode */}
      {editMode && (
        <div className="flex gap-2 pt-1">
          <button onClick={saveEdit} className="btn-primary text-[12px]">Save</button>
          <button onClick={cancelEdit} className="btn-ghost text-[12px]">Cancel</button>
        </div>
      )}

      {showDelete && (
        <ConfirmDialog
          message={`Delete "${company.name}" and all its connections?`}
          onConfirm={() => { deleteCompany(id); onDeleted(); setShowDelete(false) }}
          onCancel={() => setShowDelete(false)}
        />
      )}

      {showAddConn && (
        <AddConnectionModal forCompanyId={id} onClose={() => setShowAddConn(false)} />
      )}
    </Shell>
  )
}

// ── Person panel ────────────────────────────────────────────────────────────

function PersonPanel({ id, onClose, onDeleted }: { id: string; onClose: () => void; onDeleted: () => void }) {
  const { data, updatePerson, deletePerson, deleteConnection } = useApp()
  const person = data.people.find((p) => p.id === id)

  const [editMode, setEditMode] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [showAddConn, setShowAddConn] = useState(false)

  const [eName, setEName] = useState('')
  const [eCompany, setECompany] = useState('')
  const [eRole, setERole] = useState('')
  const [ePrev, setEPrev] = useState<[string, string]>(['', ''])
  const [eUni, setEUni] = useState('')
  const [eHowWeMet, setEHowWeMet] = useState('')
  const [eBacklinks, setEBacklinks] = useState<{ label: string; url: string }[]>([])

  const enterEdit = () => {
    if (!person) return
    setEName(person.name)
    setECompany(person.currentCompany ?? '')
    setERole(person.role ?? '')
    const prev = person.previousCompanies ?? []
    setEPrev([prev[0] ?? '', prev[1] ?? ''])
    setEUni(person.university ?? '')
    setEHowWeMet(person.howWeMet ?? '')
    setEBacklinks((person.backlinks ?? []).map((b) => ({ ...b })))
    setEditMode(true)
  }

  const cancelEdit = () => setEditMode(false)

  const saveEdit = () => {
    if (!person || !eName.trim()) return
    updatePerson({
      ...person,
      name: eName.trim(),
      currentCompany: eCompany.trim() || undefined,
      role: eRole.trim() || undefined,
      previousCompanies: ePrev.filter(Boolean),
      university: eUni.trim() || undefined,
      howWeMet: eHowWeMet.trim() || undefined,
      backlinks: eBacklinks.filter((b) => b.label.trim() && b.url.trim()),
    })
    setEditMode(false)
  }

  const updateBL = (i: number, patch: Partial<{ label: string; url: string }>) =>
    setEBacklinks((bl) => bl.map((b, idx) => (idx === i ? { ...b, ...patch } : b)))

  useEffect(() => { setEditMode(false) }, [id])

  if (!person) return null

  const connections = data.connections.filter((c) => c.personId === id)

  return (
    <Shell label="Contact" onClose={onClose}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        {editMode ? (
          <input
            autoFocus
            value={eName}
            onChange={(e) => setEName(e.target.value)}
            className="field-input flex-1 text-[15px] font-semibold"
          />
        ) : (
          <div>
            <h2 style={{ color: 'var(--text-primary)' }} className="text-[17px] font-semibold tracking-tight">
              {person.name}
            </h2>
            {(person.role || person.currentCompany) && (
              <p style={{ color: 'var(--text-secondary)' }} className="text-[11px] mt-0.5">
                {[person.role, person.currentCompany].filter(Boolean).join(' · ')}
              </p>
            )}
          </div>
        )}
        {!editMode && (
          <div className="flex gap-1 shrink-0">
            <button onClick={enterEdit} className="btn-ghost text-[11px]">Edit</button>
            <button onClick={() => setShowDelete(true)} className="btn-ghost text-[11px]" style={{ color: '#dc2626' }}>Delete</button>
          </div>
        )}
      </div>

      {/* Current company + role in edit mode */}
      {editMode && (
        <Section label="Current">
          <div className="flex gap-2">
            <input
              type="text"
              value={eCompany}
              onChange={(e) => setECompany(e.target.value)}
              placeholder="Company"
              className="field-input flex-1"
            />
            <input
              type="text"
              value={eRole}
              onChange={(e) => setERole(e.target.value)}
              placeholder="Role"
              className="field-input flex-1"
            />
          </div>
        </Section>
      )}

      {/* Background */}
      {(!editMode && (person.university || (person.previousCompanies ?? []).length > 0)) && (
        <Section label="Background">
          <div className="space-y-1">
            {person.university && <Row label="University" value={person.university} />}
            {(person.previousCompanies ?? []).length > 0 && (
              <Row label="Previously" value={(person.previousCompanies ?? []).join(', ')} />
            )}
          </div>
        </Section>
      )}

      {editMode && (
        <Section label="Previous companies">
          <div className="flex gap-2">
            <input
              type="text"
              value={ePrev[0]}
              onChange={(e) => setEPrev([e.target.value, ePrev[1]])}
              placeholder="Previous 1"
              className="field-input flex-1"
            />
            <input
              type="text"
              value={ePrev[1]}
              onChange={(e) => setEPrev([ePrev[0], e.target.value])}
              placeholder="Previous 2"
              className="field-input flex-1"
            />
          </div>
        </Section>
      )}

      {editMode && (
        <Section label="University">
          <input
            type="text"
            value={eUni}
            onChange={(e) => setEUni(e.target.value)}
            placeholder="e.g. Columbia"
            className="field-input w-full"
          />
        </Section>
      )}

      {/* How we met */}
      {(editMode || person.howWeMet) && (
        <Section label="How we met">
          {editMode ? (
            <textarea
              value={eHowWeMet}
              onChange={(e) => setEHowWeMet(e.target.value)}
              rows={2}
              className="field-input w-full resize-none"
            />
          ) : (
            <p style={{ color: 'var(--text-secondary)' }} className="text-[12px] leading-relaxed">
              {person.howWeMet}
            </p>
          )}
        </Section>
      )}

      {/* Backlinks */}
      {(!editMode && (person.backlinks ?? []).length > 0) && (
        <Section label="Links">
          <div className="flex flex-wrap gap-2">
            {(person.backlinks ?? []).map((b) => (
              <a
                key={b.label}
                href={b.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ borderColor: 'var(--border)', color: 'var(--text-primary)', backgroundColor: 'var(--bg)' }}
                className="text-[11px] border rounded-md px-2.5 py-1 hover:opacity-70 transition-opacity"
              >
                {b.label} ↗
              </a>
            ))}
          </div>
        </Section>
      )}

      {editMode && (
        <Section label="Links">
          <div className="space-y-2">
            {eBacklinks.map((b, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={b.label}
                  onChange={(e) => updateBL(i, { label: e.target.value })}
                  placeholder="Label"
                  className="field-input w-24"
                />
                <input
                  type="url"
                  value={b.url}
                  onChange={(e) => updateBL(i, { url: e.target.value })}
                  placeholder="https://…"
                  className="field-input flex-1"
                />
                <button
                  onClick={() => setEBacklinks((bl) => bl.filter((_, idx) => idx !== i))}
                  style={{ color: 'var(--text-secondary)' }}
                  className="text-[14px]"
                >×</button>
              </div>
            ))}
            <button
              onClick={() => setEBacklinks((bl) => [...bl, { label: '', url: '' }])}
              style={{ color: 'var(--text-secondary)' }}
              className="text-[11px] hover:opacity-70"
            >
              + Add link
            </button>
          </div>
        </Section>
      )}

      {/* Connections */}
      <Section label={`Connections (${connections.length})`}>
        <div className="space-y-1.5">
          {connections.length === 0 ? (
            <Empty>No companies connected yet</Empty>
          ) : (
            connections.map((conn) => {
              const company = data.companies.find((c) => c.id === conn.companyId)
              return (
                <ConnectionRow
                  key={conn.id}
                  label={company?.name ?? 'Unknown'}
                  sublabel={conn.relationship}
                  onDelete={() => deleteConnection(conn.id)}
                  editMode={editMode}
                />
              )
            })
          )}
        </div>
        {!editMode && (
          <button
            onClick={() => setShowAddConn(true)}
            style={{ color: 'var(--text-secondary)' }}
            className="text-[11px] mt-2 hover:opacity-70"
          >
            + Add connection
          </button>
        )}
      </Section>

      {editMode && (
        <div className="flex gap-2 pt-1">
          <button onClick={saveEdit} className="btn-primary text-[12px]">Save</button>
          <button onClick={cancelEdit} className="btn-ghost text-[12px]">Cancel</button>
        </div>
      )}

      {showDelete && (
        <ConfirmDialog
          message={`Remove "${person.name}" and all their connections?`}
          onConfirm={() => { deletePerson(id); onDeleted(); setShowDelete(false) }}
          onCancel={() => setShowDelete(false)}
        />
      )}

      {showAddConn && (
        <AddConnectionModal forPersonId={id} onClose={() => setShowAddConn(false)} />
      )}
    </Shell>
  )
}

// ── Shared sub-components ───────────────────────────────────────────────────

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span
        style={{ color: 'var(--text-secondary)' }}
        className="text-[9px] uppercase tracking-widest font-medium block mb-1.5"
      >
        {label}
      </span>
      {children}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span style={{ color: 'var(--text-secondary)' }} className="text-[11px] w-20 shrink-0">
        {label}
      </span>
      <span style={{ color: 'var(--text-primary)' }} className="text-[11px]">
        {value}
      </span>
    </div>
  )
}

function Tag({ label }: { label: string }) {
  return (
    <span
      style={{ backgroundColor: 'var(--border)', color: 'var(--text-secondary)', fontSize: '9px' }}
      className="rounded px-1.5 py-0.5 font-medium uppercase tracking-wide"
    >
      {label}
    </span>
  )
}

function TierBadge({ tier }: { tier: 'S' | 'A' }) {
  return (
    <span
      style={{
        backgroundColor: tier === 'S' ? 'var(--text-primary)' : 'var(--border)',
        color: tier === 'S' ? 'var(--node-bg)' : 'var(--text-secondary)',
        fontSize: '9px',
      }}
      className="rounded px-1.5 py-0.5 font-bold uppercase tracking-wide"
    >
      {tier}-tier
    </span>
  )
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ color: 'var(--text-secondary)' }} className="text-[11px] italic">
      {children}
    </p>
  )
}

function ConnectionRow({
  label,
  sublabel,
  onDelete,
  editMode,
}: {
  label: string
  sublabel: string
  onDelete: () => void
  editMode: boolean
}) {
  return (
    <div
      style={{ borderColor: 'var(--border)' }}
      className="border rounded-lg px-3 py-2 flex items-start justify-between gap-2"
    >
      <div className="min-w-0">
        <div style={{ color: 'var(--text-primary)' }} className="text-[12px] font-medium truncate">
          {label}
        </div>
        <div style={{ color: 'var(--text-secondary)' }} className="text-[10px] leading-snug mt-0.5">
          {sublabel}
        </div>
      </div>
      {editMode && (
        <button
          onClick={onDelete}
          style={{ color: 'var(--text-secondary)' }}
          className="text-[13px] shrink-0 hover:opacity-70 mt-0.5"
        >
          ×
        </button>
      )}
    </div>
  )
}

// Re-export types for Graph.tsx
export type { Selection as SidePanelSelection }
