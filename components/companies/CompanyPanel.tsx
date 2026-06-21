'use client'

import { useEffect, useState } from 'react'
import { Globe, Linkedin, Plus, Trash2, Check, X } from 'lucide-react'
import Link from 'next/link'
import type { Company, Todo, Exec } from '@/types'
import { Drawer } from '@/components/ui/Drawer'
import { Badge } from '@/components/ui/Badge'
import { useOrbitStore } from '@/store/useOrbitStore'

interface CompanyPanelProps {
  companyId: string | null
  onClose: () => void
}

export function CompanyPanel({ companyId, onClose }: CompanyPanelProps) {
  const [company, setCompany] = useState<Company | null>(null)
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [addingTodo, setAddingTodo] = useState(false)
  const { addToast } = useOrbitStore()

  useEffect(() => {
    if (!companyId) { setCompany(null); setTodos([]); return }
    fetch(`/api/companies/${companyId}`)
      .then((r) => r.json())
      .then((data: Company) => {
        setCompany(data)
        setTodos(data.todos || [])
      })
  }, [companyId])

  const toggleTodo = async (todo: Todo) => {
    const res = await fetch(`/api/companies/${companyId}/todos/${todo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: !todo.done }),
    })
    if (res.ok) {
      const updated = await res.json()
      setTodos((ts) => ts.map((t) => (t.id === todo.id ? updated : t)))
    }
  }

  const deleteTodo = async (todoId: string) => {
    const res = await fetch(`/api/companies/${companyId}/todos/${todoId}`, { method: 'DELETE' })
    if (res.ok) setTodos((ts) => ts.filter((t) => t.id !== todoId))
  }

  const addTodo = async () => {
    if (!newTodo.trim()) return
    setAddingTodo(true)
    const res = await fetch(`/api/companies/${companyId}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label: newTodo }),
    })
    if (res.ok) {
      const todo = await res.json()
      setTodos((ts) => [...ts, todo])
      setNewTodo('')
      addToast('Task added')
    }
    setAddingTodo(false)
  }

  return (
    <Drawer open={!!companyId} onClose={onClose} title={company?.name ?? 'Company'}>
      {!company ? (
        <div className="flex items-center justify-center h-32 text-neutral-400 text-sm">Loading…</div>
      ) : (
        <div className="p-5 space-y-6">
          {/* Header */}
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-xl font-bold text-neutral-400 shrink-0">
              {company.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-neutral-900 dark:text-neutral-100">{company.name}</h2>
              {company.geography && <p className="text-xs text-neutral-500">{company.geography}</p>}
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-accent hover:underline mt-0.5"
                >
                  <Globe className="w-3 h-3" />
                  {company.website.replace(/^https?:\/\//, '')}
                </a>
              )}
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge value={company.stage} variant="stage" />
            <Badge value={company.status} variant="status" />
            <Badge value={company.sector} variant="default" />
          </div>

          {/* Description */}
          {company.description && (
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {company.description}
            </p>
          )}

          {/* Todos */}
          <div>
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-2">Tasks</p>
            <div className="space-y-1.5">
              {todos.map((todo) => (
                <div key={todo.id} className="flex items-center gap-2 group">
                  <button
                    onClick={() => toggleTodo(todo)}
                    className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors
                      ${todo.done
                        ? 'bg-accent border-accent text-white'
                        : 'border-neutral-300 dark:border-neutral-600 hover:border-accent'
                      }`}
                  >
                    {todo.done && <Check className="w-2.5 h-2.5" />}
                  </button>
                  <span className={`text-sm flex-1 ${todo.done ? 'line-through text-neutral-400' : 'text-neutral-700 dark:text-neutral-300'}`}>
                    {todo.label}
                  </span>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-red-500 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <div className="flex items-center gap-2 mt-2">
                <input
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') addTodo() }}
                  placeholder="Add a task…"
                  className="flex-1 h-7 px-2 text-xs rounded-input bg-neutral-100 dark:bg-neutral-800 border border-transparent focus:border-accent outline-none text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400"
                />
                <button
                  onClick={addTodo}
                  disabled={addingTodo || !newTodo.trim()}
                  className="h-7 px-2 rounded-input bg-accent text-white text-xs hover:bg-indigo-500 disabled:opacity-50 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Contacts at this company */}
          {company.contacts && company.contacts.length > 0 && (
            <div>
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-2">People Here</p>
              <div className="space-y-2">
                {company.contacts.map((contact) => (
                  <div key={contact.id} className="flex items-center gap-2 text-sm">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-xs text-accent font-medium">
                      {contact.name[0]}
                    </div>
                    <span className="text-neutral-700 dark:text-neutral-300">{contact.name}</span>
                    <span className="text-neutral-400 text-xs">· {contact.role}</span>
                    <Badge value={contact.purpose} variant="purpose" className="ml-auto" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Execs */}
          {company.execs && company.execs.length > 0 && (
            <div>
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-2">Executives</p>
              <div className="space-y-2">
                {company.execs.map((exec) => (
                  <div key={exec.id} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-sm font-semibold text-neutral-600 dark:text-neutral-400 shrink-0">
                      {exec.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">{exec.name}</p>
                      <p className="text-xs text-neutral-500 truncate">{exec.title}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Badge value={exec.relevance} variant="relevance" />
                      {exec.linkedin && (
                        <a href={exec.linkedin} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-accent transition-colors">
                          <Linkedin className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Drawer>
  )
}
