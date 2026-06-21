'use client'

import { create } from 'zustand'
import type { Toast } from '@/types'

interface OrbitStore {
  sidebarExpanded: boolean
  toggleSidebar: () => void
  setSidebarExpanded: (v: boolean) => void

  theme: 'dark' | 'light'
  setTheme: (t: 'dark' | 'light') => void

  toasts: Toast[]
  addToast: (msg: string, type?: Toast['type']) => void
  removeToast: (id: string) => void
}

let toastCounter = 0

export const useOrbitStore = create<OrbitStore>((set) => ({
  sidebarExpanded: true,
  toggleSidebar: () => set((s) => ({ sidebarExpanded: !s.sidebarExpanded })),
  setSidebarExpanded: (v) => set({ sidebarExpanded: v }),

  theme: 'dark',
  setTheme: (t) => set({ theme: t }),

  toasts: [],
  addToast: (msg, type = 'success') => {
    const id = `toast-${++toastCounter}`
    set((s) => ({ toasts: [...s.toasts, { id, message: msg, type }] }))
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
    }, 3500)
  },
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))
