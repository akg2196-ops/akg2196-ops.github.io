import { ExecCards } from '@/components/grow/ExecCards'
import { EventsList } from '@/components/grow/EventsList'

export default function GrowPage() {
  return (
    <div className="p-6 space-y-10">
      <section>
        <div className="mb-4">
          <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">People to Meet</h2>
          <p className="text-xs text-neutral-500 mt-0.5">Executives at companies on your watchlist — warm intros waiting to happen.</p>
        </div>
        <ExecCards />
      </section>

      <div className="border-t border-neutral-200 dark:border-neutral-800" />

      <section>
        <div className="mb-4">
          <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">Events</h2>
          <p className="text-xs text-neutral-500 mt-0.5">Upcoming conferences, dinners, and demo days worth your time.</p>
        </div>
        <EventsList />
      </section>
    </div>
  )
}
