'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { useOrbitStore } from '@/store/useOrbitStore'

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { toasts, removeToast } = useOrbitStore()

  return (
    <>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 min-w-[280px] max-w-sm">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className={`flex items-start gap-3 px-4 py-3 rounded-card border shadow-lg
                ${toast.type === 'success'
                  ? 'bg-white dark:bg-neutral-900 border-green-200 dark:border-green-800'
                  : toast.type === 'error'
                  ? 'bg-white dark:bg-neutral-900 border-red-200 dark:border-red-800'
                  : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700'
                }`}
            >
              {toast.type === 'success' && <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />}
              <p className="text-sm text-neutral-700 dark:text-neutral-300 flex-1">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  )
}
