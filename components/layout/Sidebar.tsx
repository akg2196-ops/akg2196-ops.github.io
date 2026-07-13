'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Users, Building2, Sparkles, Newspaper, TrendingUp, ChevronLeft, Orbit } from 'lucide-react'
import { useOrbitStore } from '@/store/useOrbitStore'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/connections', icon: Users, label: 'Connections' },
  { href: '/companies', icon: Building2, label: 'My Companies' },
  { href: '/grow', icon: Sparkles, label: 'Grow' },
  { href: '/feed', icon: Newspaper, label: 'Feed' },
  { href: '/trending', icon: TrendingUp, label: 'Trending' },
]

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarExpanded, toggleSidebar } = useOrbitStore()

  return (
    <motion.aside
      animate={{ width: sidebarExpanded ? 240 : 64 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className="relative flex flex-col h-full shrink-0 overflow-hidden
                 bg-white dark:bg-neutral-950
                 border-r border-neutral-200 dark:border-neutral-800
                 z-30"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-14 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
          <Orbit className="w-4 h-4 text-white" />
        </div>
        {sidebarExpanded && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm tracking-tight"
          >
            Orbit
          </motion.span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-hidden">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 mx-2 rounded-card transition-colors duration-[80ms]',
                active
                  ? 'bg-accent/10 text-accent dark:bg-accent/20 dark:text-indigo-400'
                  : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {sidebarExpanded && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm font-medium whitespace-nowrap"
                >
                  {label}
                </motion.span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="shrink-0 p-2 border-t border-neutral-200 dark:border-neutral-800">
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center w-full h-8 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
        >
          <motion.div animate={{ rotate: sidebarExpanded ? 0 : 180 }} transition={{ duration: 0.15 }}>
            <ChevronLeft className="w-4 h-4" />
          </motion.div>
        </button>
      </div>
    </motion.aside>
  )
}
