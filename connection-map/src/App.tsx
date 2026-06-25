import { useState, useEffect } from 'react'
import Graph from './Graph'
import ThemeToggle from './components/ThemeToggle'

export default function App() {
  const [dark, setDark] = useState(true)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <div
      style={{ backgroundColor: 'var(--bg)', width: '100vw', height: '100vh' }}
      className="relative overflow-hidden"
    >
      {/* Header bar */}
      <div
        style={{
          backgroundColor: 'var(--surface)',
          borderBottomColor: 'var(--border)',
          color: 'var(--text-secondary)',
        }}
        className="absolute top-0 left-0 right-0 h-10 border-b flex items-center px-4 z-30 gap-3"
      >
        <span
          style={{ color: 'var(--text-primary)' }}
          className="text-[13px] font-medium tracking-tight"
        >
          Connection Map
        </span>
        <span className="text-[11px]">·</span>
        <span className="text-[11px]">Click a company to highlight connections</span>
      </div>

      {/* Graph canvas offset below header */}
      <div className="absolute inset-0 pt-10">
        <Graph />
      </div>

      <ThemeToggle dark={dark} onToggle={() => setDark((d) => !d)} />
    </div>
  )
}
