import { useState, useEffect } from 'react'
import Graph from './Graph'
import ThemeToggle from './components/ThemeToggle'
import AddCompanyModal from './components/AddCompanyModal'
import AddPersonModal from './components/AddPersonModal'
import SidePanel from './components/SidePanel'
import NextStepsCard from './components/NextStepsCard'
import { AppProvider } from './context'
import type { Selection } from './data'

export default function App() {
  const [dark, setDark] = useState(true)
  const [sel, setSel] = useState<Selection | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showNextSteps, setShowNextSteps] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  }, [dark])

  function handleSelectionChange(s: Selection | null) {
    setSel(s)
  }

  function handleSearchChange(q: string) {
    setSearchQuery(q)
    if (q) setSel(null)
  }

  return (
    <AppProvider>
      <div
        style={{ backgroundColor: 'var(--bg)', width: '100vw', height: '100vh' }}
        className="relative overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div
          style={{ backgroundColor: 'var(--surface)', borderBottomColor: 'var(--border)' }}
          className="h-10 border-b flex items-center px-4 gap-3 shrink-0 z-30"
        >
          <span style={{ color: 'var(--text-primary)' }} className="text-[13px] font-medium tracking-tight shrink-0">
            Connection Map
          </span>

          {/* Search */}
          <div className="relative flex-1 max-w-[220px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search people, companies…"
              style={{
                backgroundColor: 'var(--bg)',
                borderColor: 'var(--border)',
                color: 'var(--text-primary)',
              }}
              className="w-full h-6 rounded-md border px-2.5 text-[11px] placeholder:text-[var(--text-secondary)] outline-none focus:border-[var(--text-secondary)] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearchChange('')}
                style={{ color: 'var(--text-secondary)' }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[14px] leading-none hover:opacity-70"
              >
                ×
              </button>
            )}
          </div>

          {/* Next Steps button */}
          <button
            onClick={() => setShowNextSteps((v) => !v)}
            style={{
              color: showNextSteps ? 'var(--text-primary)' : 'var(--text-secondary)',
              borderColor: 'var(--border)',
              backgroundColor: showNextSteps ? 'var(--border)' : 'transparent',
            }}
            className="border rounded-md px-2.5 h-6 text-[11px] font-medium transition-colors hover:opacity-80"
          >
            Next Steps
          </button>

          <AddButtons />
        </div>

        {/* Canvas */}
        <div className="flex-1 relative">
          <Graph
            selection={sel}
            onSelectionChange={handleSelectionChange}
            searchQuery={searchQuery}
          />
        </div>

        {/* Overlays */}
        {showNextSteps && (
          <NextStepsCard
            onClose={() => setShowNextSteps(false)}
            onSelect={(s) => {
              setSel(s)
              setShowNextSteps(false)
            }}
          />
        )}

        <SidePanel
          selection={sel}
          onClose={() => setSel(null)}
          onDeleted={() => setSel(null)}
        />

        <ThemeToggle dark={dark} onToggle={() => setDark((d) => !d)} />
      </div>
    </AppProvider>
  )
}

function AddButtons() {
  const [showAddCompany, setShowAddCompany] = useState(false)
  const [showAddPerson, setShowAddPerson] = useState(false)

  return (
    <>
      <div className="flex gap-2 ml-auto">
        <button onClick={() => setShowAddPerson(true)} className="btn-ghost text-[11px] h-6 px-2.5">
          + Person
        </button>
        <button onClick={() => setShowAddCompany(true)} className="btn-primary text-[11px] h-6 px-2.5">
          + Company
        </button>
      </div>
      {showAddCompany && <AddCompanyModal onClose={() => setShowAddCompany(false)} />}
      {showAddPerson && <AddPersonModal onClose={() => setShowAddPerson(false)} />}
    </>
  )
}
