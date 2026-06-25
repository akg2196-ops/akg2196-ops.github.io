import { useState, useEffect } from 'react'
import Graph from './Graph'
import ThemeToggle from './components/ThemeToggle'
import AddCompanyModal from './components/AddCompanyModal'
import AddPersonModal from './components/AddPersonModal'
import { AppProvider } from './context'

export default function App() {
  const [dark, setDark] = useState(true)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <AppProvider>
      <div
        style={{ backgroundColor: 'var(--bg)', width: '100vw', height: '100vh' }}
        className="relative overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div
          style={{ backgroundColor: 'var(--surface)', borderBottomColor: 'var(--border)' }}
          className="h-10 border-b flex items-center px-4 gap-4 shrink-0 z-30"
        >
          <span style={{ color: 'var(--text-primary)' }} className="text-[13px] font-medium tracking-tight">
            Connection Map
          </span>
          <span style={{ color: 'var(--text-secondary)' }} className="text-[11px]">·</span>
          <span style={{ color: 'var(--text-secondary)' }} className="text-[11px] hidden sm:block">
            Click a node to highlight connections
          </span>
          <AddButtons />
        </div>

        {/* Canvas */}
        <div className="flex-1 relative">
          <Graph />
        </div>

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
