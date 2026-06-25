import type { AppData } from './data'

const KEY = 'connectionMapData'

export function loadData(): AppData | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    return JSON.parse(raw) as AppData
  } catch {
    return null
  }
}

export function saveData(data: AppData): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(data))
  } catch { /* quota */ }
}

export function clearData(): void {
  localStorage.removeItem(KEY)
}
