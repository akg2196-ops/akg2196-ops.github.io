type Props = {
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  message,
  confirmLabel = 'Delete',
  onConfirm,
  onCancel,
}: Props) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)',
        }}
        className="relative border rounded-xl p-5 w-[340px] shadow-xl z-10"
      >
        <p style={{ color: 'var(--text-primary)' }} className="text-[13px] leading-relaxed mb-5">
          {message}
        </p>
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} className="btn-ghost text-[12px]">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="text-[12px] px-3 py-1.5 rounded-lg font-medium"
            style={{ backgroundColor: '#dc2626', color: '#fff' }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
