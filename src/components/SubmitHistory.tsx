import { useId, useState } from 'react'
import {
  formatSubmitHistoryTitle,
  presentSubmitEntry,
  type SubmitHistoryEntry,
} from '../game/submitHistory.ts'
import { DrinkCard } from './DrinkCard.tsx'

type SubmitHistoryProps = {
  entries: readonly SubmitHistoryEntry[]
}

export function SubmitHistory({ entries }: SubmitHistoryProps) {
  const [open, setOpen] = useState(false)
  const listId = useId()

  return (
    <section className="submit-history" data-testid="submit-history">
      <button
        type="button"
        className="submit-history__toggle"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((value) => !value)}
      >
        <span>{formatSubmitHistoryTitle(entries.length)}</span>
        <span className="submit-history__action">{open ? '收合' : '展開'}</span>
      </button>
      {open ? (
        <ol
          id={listId}
          className="submit-history__list"
          data-testid="submit-history-list"
        >
          {entries.length === 0 ? (
            <li className="submit-history__empty">還沒有送出紀錄</li>
          ) : (
            entries.map((entry) => {
              const presented = presentSubmitEntry(entry)
              return (
                <li key={entry.id} className="submit-history__row">
                  <div className="submit-history__thumbs">
                    {presented.lineup.map((drinkId, index) => (
                      <DrinkCard
                        key={`${entry.id}-${index}`}
                        drinkId={drinkId}
                        size="thumb"
                      />
                    ))}
                  </div>
                  <p
                    className="submit-history__count"
                    data-testid="submit-history-count"
                  >
                    {presented.label}
                  </p>
                </li>
              )
            })
          )}
        </ol>
      ) : null}
    </section>
  )
}
