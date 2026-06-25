import type { SelectedNode, Company, Person } from '../data'

type Props = {
  node: SelectedNode | null
  onClose: () => void
}

export default function DetailPanel({ node, onClose }: Props) {
  if (!node) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Panel */}
      <div
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)',
          color: 'var(--text-primary)',
        }}
        className="fixed right-0 top-0 h-full w-[340px] z-50 border-l shadow-xl overflow-y-auto"
      >
        {/* Header */}
        <div
          style={{ borderBottomColor: 'var(--border)' }}
          className="flex items-center justify-between px-5 py-4 border-b"
        >
          <span
            style={{ color: 'var(--text-secondary)' }}
            className="text-[11px] uppercase tracking-widest font-medium"
          >
            {node.kind === 'company' ? 'Company' : 'Contact'}
          </span>
          <button
            onClick={onClose}
            style={{ color: 'var(--text-secondary)' }}
            className="text-[18px] leading-none hover:opacity-70 transition-opacity"
          >
            ×
          </button>
        </div>

        <div className="px-5 py-5 space-y-5">
          {node.kind === 'company' && <CompanyDetail data={node.data} />}
          {node.kind === 'person' && <PersonDetail data={node.data} />}
        </div>
      </div>
    </>
  )
}

function CompanyDetail({ data }: { data: Company }) {
  return (
    <>
      <div>
        <h2
          style={{ color: 'var(--text-primary)' }}
          className="text-[20px] font-semibold tracking-tight"
        >
          {data.name}
        </h2>
        {data.applicationDeadline && (
          <p style={{ color: 'var(--text-secondary)' }} className="text-[12px] mt-1">
            Deadline: {data.applicationDeadline}
          </p>
        )}
      </div>

      <Section label="Roles">
        <div className="space-y-2">
          {data.roles.map((r) => (
            <div key={r.title} style={{ borderColor: 'var(--border)' }} className="border rounded-lg p-3">
              <div className="flex items-start justify-between gap-2">
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--text-primary)' }}
                  className="text-[12px] font-medium hover:underline leading-snug"
                >
                  {r.title} ↗
                </a>
                <div className="flex gap-1 shrink-0">
                  <Tag label={r.track} />
                  {r.eligible && <Tag label="Eligible" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {data.notes && (
        <Section label="Notes">
          <p style={{ color: 'var(--text-secondary)' }} className="text-[12px] leading-relaxed">
            {data.notes}
          </p>
        </Section>
      )}
    </>
  )
}

function PersonDetail({ data }: { data: Person }) {
  return (
    <>
      <div>
        <h2
          style={{ color: 'var(--text-primary)' }}
          className="text-[20px] font-semibold tracking-tight"
        >
          {data.name}
        </h2>
        <p style={{ color: 'var(--text-secondary)' }} className="text-[12px] mt-1">
          {data.role} · {data.currentCompany}
        </p>
      </div>

      <Section label="Background">
        <div className="space-y-1.5">
          {data.university && <Row label="University" value={data.university} />}
          {data.previousCompanies.length > 0 && (
            <Row label="Previously at" value={data.previousCompanies.join(', ')} />
          )}
        </div>
      </Section>

      {data.howWeMet && (
        <Section label="How we met">
          <p style={{ color: 'var(--text-secondary)' }} className="text-[12px] leading-relaxed">
            {data.howWeMet}
          </p>
        </Section>
      )}

      {data.backlinks && data.backlinks.length > 0 && (
        <Section label="Links">
          <div className="flex flex-wrap gap-2">
            {data.backlinks.map((b) => (
              <a
                key={b.label}
                href={b.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                  backgroundColor: 'var(--bg)',
                }}
                className="text-[11px] border rounded-md px-2.5 py-1 hover:opacity-70 transition-opacity"
              >
                {b.label} ↗
              </a>
            ))}
          </div>
        </Section>
      )}
    </>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <span
        style={{ color: 'var(--text-secondary)' }}
        className="text-[10px] uppercase tracking-widest font-medium block"
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
      <span style={{ color: 'var(--text-secondary)' }} className="text-[11px] w-24 shrink-0">
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
      style={{
        backgroundColor: 'var(--border)',
        color: 'var(--text-secondary)',
        fontSize: '10px',
      }}
      className="rounded px-1.5 py-0.5 font-medium uppercase tracking-wide"
    >
      {label}
    </span>
  )
}
