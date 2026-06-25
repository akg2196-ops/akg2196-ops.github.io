type Props = {
  dark: boolean
  onToggle: () => void
}

export default function ThemeToggle({ dark, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)',
        color: 'var(--text-secondary)',
      }}
      className="fixed top-4 right-4 z-50 w-8 h-8 rounded-full border flex items-center justify-center hover:opacity-70 transition-opacity text-[14px]"
    >
      {dark ? '☀︎' : '☽'}
    </button>
  )
}
