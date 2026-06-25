import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { defaultData, type AppData, type Company, type Connection, type Person } from './data'
import { loadData, saveData } from './storage'

function genId(): string {
  return (
    (crypto as unknown as { randomUUID?: () => string }).randomUUID?.() ??
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
  )
}

type ContextValue = {
  data: AppData
  addCompany: (c: Omit<Company, 'id'>) => void
  updateCompany: (c: Company) => void
  deleteCompany: (id: string) => void
  addPerson: (p: Omit<Person, 'id'>) => void
  updatePerson: (p: Person) => void
  deletePerson: (id: string) => void
  addConnection: (c: Omit<Connection, 'id'>) => void
  updateConnection: (c: Connection) => void
  deleteConnection: (id: string) => void
}

const AppContext = createContext<ContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(() => loadData() ?? defaultData)

  useEffect(() => {
    saveData(data)
  }, [data])

  const addCompany = useCallback((c: Omit<Company, 'id'>) => {
    setData((d) => ({ ...d, companies: [...d.companies, { ...c, id: genId() }] }))
  }, [])

  const updateCompany = useCallback((c: Company) => {
    setData((d) => ({ ...d, companies: d.companies.map((x) => (x.id === c.id ? c : x)) }))
  }, [])

  const deleteCompany = useCallback((id: string) => {
    setData((d) => ({
      ...d,
      companies: d.companies.filter((c) => c.id !== id),
      connections: d.connections.filter((c) => c.companyId !== id),
    }))
  }, [])

  const addPerson = useCallback((p: Omit<Person, 'id'>) => {
    setData((d) => ({ ...d, people: [...d.people, { ...p, id: genId() }] }))
  }, [])

  const updatePerson = useCallback((p: Person) => {
    setData((d) => ({ ...d, people: d.people.map((x) => (x.id === p.id ? p : x)) }))
  }, [])

  const deletePerson = useCallback((id: string) => {
    setData((d) => ({
      ...d,
      people: d.people.filter((p) => p.id !== id),
      connections: d.connections.filter((c) => c.personId !== id),
    }))
  }, [])

  const addConnection = useCallback((c: Omit<Connection, 'id'>) => {
    setData((d) => ({ ...d, connections: [...d.connections, { ...c, id: genId() }] }))
  }, [])

  const updateConnection = useCallback((c: Connection) => {
    setData((d) => ({ ...d, connections: d.connections.map((x) => (x.id === c.id ? c : x)) }))
  }, [])

  const deleteConnection = useCallback((id: string) => {
    setData((d) => ({ ...d, connections: d.connections.filter((c) => c.id !== id) }))
  }, [])

  return (
    <AppContext.Provider
      value={{
        data,
        addCompany,
        updateCompany,
        deleteCompany,
        addPerson,
        updatePerson,
        deletePerson,
        addConnection,
        updateConnection,
        deleteConnection,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp(): ContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
