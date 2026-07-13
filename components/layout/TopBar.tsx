'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Search, Sun, Moon } from 'lucide-react'
import { useOrbitStore } from '@/store/useOrbitStore'

const sectionTitles: Record<string, string> = {
  '/connections': 'Connections',
  '/companies': 'My Companies',
  '/grow': 'Grow',
  '/feed': 'Feed',
  '/trending': 'Trending',
}

interface TopBarProps {
  initialTheme: 'dark' | 'light'
}

export function TopBar({ initialTheme }: TopBarProps) {
  const pathname = usePathname()
  const searchRef = useRef<HTMLInputElement>(null)
  const { theme, setTheme } = useOrbitStore()
  const [mounted, setMounted] = useState(false)

  const title = sectionTitles[pathname] ?? 'Orbit'

  useEffect(() => {
    setMounted(true)
    setTheme(initialTheme)
  }, [initialTheme, setTheme])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const toggleTheme = async () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.classList.toggle('dark', next === 'dark')
    setTheme(next)
    await fetch('/api/theme', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme: next }),
    })
  }

  const currentTheme = mounted ? theme : initialTheme

  return (
    <header className="flex items-center gap-4 px-6 h-14 shrink-0 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
      <h1 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 min-w-[120px]">
        {title}
      </h1>

      <div className="flex-1 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
        <input
          ref={searchRef}
          type="text"
          placeholder="Search… (⌘K)"
          className="w-full h-8 pl-8 pr-4 text-xs rounded-input
                     bg-neutral-100 dark:bg-neutral-800
                     text-neutral-900 dark:text-neutral-100
                     placeholder:text-neutral-400
                     border border-transparent focus:border-accent focus:bg-white dark:focus:bg-neutral-900
                     outline-none transition-colors"
        />
      </div>

      <button
        onClick={toggleTheme}
        className="ml-auto p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
        aria-label="Toggle theme"
      >
        {currentTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>
    </header>
  )
}
