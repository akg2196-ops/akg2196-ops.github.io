'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Calendar, MapPin, ExternalLink, Check } from 'lucide-react'
import type { Event, EventType } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { useOrbitStore } from '@/store/useOrbitStore'

const EVENT_TYPES: EventType[] = ['CONFERENCE', 'DINNER', 'MEETUP', 'DEMO_DAY']

export function EventsList() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState('')
  const [filterCity, setFilterCity] = useState('')
  const { addToast } = useOrbitStore()

  useEffect(() => {
    const params = new URLSearchParams()
    if (filterType) params.set('type', filterType)
    if (filterCity) params.set('city', filterCity)
    fetch(`/api/events?${params}`)
      .then((r) => r.json())
      .then((data) => { setEvents(data); setLoading(false) })
  }, [filterType, filterCity])

  const toggleRsvp = async (event: Event) => {
    const res = await fetch(`/api/events/${event.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rsvp: !event.rsvp }),
    })
    if (res.ok) {
      const updated = await res.json()
      setEvents((es) => es.map((e) => (e.id === event.id ? updated : e)))
      addToast(updated.rsvp ? 'RSVP confirmed' : 'RSVP removed')
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-3">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="h-7 px-2 text-xs rounded-input bg-neutral-100 dark:bg-neutral-800 border border-transparent focus:border-accent outline-none text-neutral-700 dark:text-neutral-300"
        >
          <option value="">All types</option>
          {EVENT_TYPES.map((t) => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
        </select>
        <input
          value={filterCity}
          onChange={(e) => setFilterCity(e.target.value)}
          placeholder="Filter by city…"
          className="h-7 px-3 text-xs rounded-input bg-neutral-100 dark:bg-neutral-800 border border-transparent focus:border-accent outline-none text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 w-40"
        />
      </div>

      {loading ? (
        <p className="text-sm text-neutral-400 py-4 text-center">Loading…</p>
      ) : events.length === 0 ? (
        <p className="text-sm text-neutral-400 py-8 text-center">No events found.</p>
      ) : (
        <div className="space-y-2">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-center gap-4 px-4 py-3 rounded-card border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
            >
              {/* Date block */}
              <div className="shrink-0 text-center w-12">
                <p className="font-mono text-lg font-bold text-neutral-900 dark:text-neutral-100 leading-none">
                  {format(new Date(event.date), 'd')}
                </p>
                <p className="font-mono text-xs text-neutral-400 uppercase">
                  {format(new Date(event.date), 'MMM')}
                </p>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-neutral-900 dark:text-neutral-100 truncate">
                  {event.name}
                </p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="flex items-center gap-1 text-xs text-neutral-500">
                    <MapPin className="w-3 h-3" />
                    {event.virtual ? 'Virtual' : event.location}
                  </span>
                  {event.virtual && (
                    <span className="text-xs px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded font-mono">Virtual</span>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="hidden md:flex flex-wrap gap-1.5 max-w-[200px]">
                <Badge value={event.type} variant="eventType" />
                {event.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="px-1.5 py-0.5 text-xs font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-500 rounded">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {event.link && (
                  <a
                    href={event.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-accent transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <button
                  onClick={() => toggleRsvp(event)}
                  className={`flex items-center gap-1.5 h-7 px-3 rounded-input text-xs font-medium transition-colors
                    ${event.rsvp
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-accent/10 hover:text-accent'
                    }`}
                >
                  {event.rsvp ? <><Check className="w-3 h-3" /> RSVP'd</> : 'RSVP'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
