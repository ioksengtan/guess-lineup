import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { hitTestDropTarget } from '../drag/hitTest.ts'
import type { DragPayload, DragSession } from '../drag/types.ts'
import { countCorrect } from '../game/countCorrect.ts'
import { formatTime } from '../game/formatTime.ts'
import { applyLineupDrop, poolSlots } from '../game/lineup.ts'
import { ConfirmDialog } from './ConfirmDialog.tsx'
import { DrinkCard } from './DrinkCard.tsx'

type Player = 'solo' | 'A' | 'B'

type PlayScreenProps = {
  player: Player
  slots: number
  poolIds: string[]
  answer: string[]
  onSolved: (elapsedMs: number) => void
  onRestartSetup: () => void
}

export function PlayScreen({
  player,
  slots,
  poolIds,
  answer,
  onSolved,
  onRestartSetup,
}: PlayScreenProps) {
  const [guess, setGuess] = useState<(string | null)[]>(() =>
    Array.from({ length: slots }, () => null),
  )
  const [lastCorrect, setLastCorrect] = useState<number | null>(null)
  const [confirmRestart, setConfirmRestart] = useState(false)
  const [drag, setDrag] = useState<DragSession | null>(null)
  const [elapsedMs, setElapsedMs] = useState(0)
  const startRef = useRef(0)
  const stoppedRef = useRef(false)
  const boardRef = useRef<HTMLElement | null>(null)
  const dragRef = useRef<DragSession | null>(null)

  useEffect(() => {
    startRef.current = performance.now()
    let frame = 0
    const tick = (t: number) => {
      if (stoppedRef.current) return
      setElapsedMs(t - startRef.current)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])
  const full = guess.every((slot) => slot !== null)
  const playerLabel =
    player === 'solo' ? '單人' : player === 'A' ? '玩家 A' : '玩家 B'
  const draggingPoolId =
    drag?.active && drag.payload.from === 'pool' ? drag.payload.drinkId : null
  const shelf = poolSlots(poolIds, guess, draggingPoolId)

  const onPointerDown = (
    event: ReactPointerEvent<HTMLElement>,
    payload: DragPayload,
  ) => {
    if (event.button !== 0 || dragRef.current) return
    event.preventDefault()
    try {
      event.currentTarget.setPointerCapture(event.pointerId)
    } catch {
      // Capture can fail if the pointer already ended; window listeners still track it.
    }
    const session: DragSession = {
      payload,
      pointerId: event.pointerId,
      originX: event.clientX,
      originY: event.clientY,
      x: event.clientX,
      y: event.clientY,
      active: false,
      over: null,
    }
    dragRef.current = session
    setDrag(session)
  }

  useEffect(() => {
    const thresholdSq = 10 * 10

    const onPointerMove = (event: PointerEvent) => {
      const current = dragRef.current
      if (!current || event.pointerId !== current.pointerId) return
      event.preventDefault()
      const dx = event.clientX - current.originX
      const dy = event.clientY - current.originY
      const active = current.active || dx * dx + dy * dy >= thresholdSq
      const session: DragSession = {
        ...current,
        x: event.clientX,
        y: event.clientY,
        active,
        over: active
          ? hitTestDropTarget(event.clientX, event.clientY, boardRef.current)
          : null,
      }
      dragRef.current = session
      setDrag(session)
    }

    const finish = (event: PointerEvent, commit: boolean) => {
      const current = dragRef.current
      if (!current || event.pointerId !== current.pointerId) return
      dragRef.current = null
      setDrag(null)
      if (commit && current.active && current.over) {
        const payload = current.payload
        const target = current.over
        setGuess((guessNow) => applyLineupDrop(guessNow, payload, target))
      }
    }

    const onPointerUp = (event: PointerEvent) => finish(event, true)
    const onPointerCancel = (event: PointerEvent) => finish(event, false)

    window.addEventListener('pointermove', onPointerMove, { passive: false })
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerCancel)
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerCancel)
    }
  }, [])

  const submit = () => {
    if (!full) return
    const n = countCorrect(guess, answer)
    setLastCorrect(n)
    if (n === slots) {
      stoppedRef.current = true
      const elapsed = performance.now() - startRef.current
      onSolved(elapsed)
    }
  }

  const draggingId = !drag?.active
    ? null
    : drag.payload.from === 'pool'
      ? drag.payload.drinkId
      : guess[drag.payload.index]

  return (
    <main
      className="screen screen--play"
      ref={boardRef}
      onContextMenu={(e) => e.preventDefault()}
    >
      {import.meta.env.DEV && (
        <span data-testid="debug-answer" hidden>
          {answer.join(',')}
        </span>
      )}

      <header className="play-bar">
        <div>
          <p className="eyebrow">{playerLabel}</p>
          <p className="timer" aria-live="off">
            {formatTime(elapsedMs)}
            <span>秒</span>
          </p>
        </div>
        <button
          type="button"
          className="btn btn--ghost btn--small"
          onClick={() => setConfirmRestart(true)}
        >
          回設定
        </button>
      </header>

      <div className="play-board">
      <section className="shelf" aria-label="排列區">
        <p className="section-label">排列</p>
        <div className="slot-row">
          {guess.map((id, index) => {
            const isSource =
              drag?.active === true &&
              drag.payload.from === 'slot' &&
              drag.payload.index === index
            const isOver =
              drag?.over?.to === 'slot' && drag.over.index === index
            return (
              <div
                key={index}
                className={`slot${id ? '' : ' is-empty'}${isOver ? ' is-over' : ''}`}
                data-drop="slot"
                data-slot-index={index}
              >
                {id ? (
                  <button
                    type="button"
                    className="drag-handle"
                    aria-label={`第 ${index + 1} 格 ${id}`}
                    onPointerDown={(e) =>
                      onPointerDown(e, { from: 'slot', index })
                    }
                  >
                    <DrinkCard drinkId={id} size="slot" dimmed={isSource} />
                  </button>
                ) : (
                  <span className="slot__placeholder">{index + 1}</span>
                )}
              </div>
            )
          })}
        </div>
      </section>

      <section
        className={`pool${drag?.over?.to === 'pool' ? ' is-over' : ''}`}
        data-drop="pool"
        aria-label="牌庫"
      >
        <p className="section-label">
          牌庫
          {drag?.active && drag.payload.from === 'slot'
            ? ' · 拖回此處可放回原位'
            : ''}
        </p>
        <div
          className="pool__row"
          style={{ '--pool-count': shelf.length } as CSSProperties}
        >
          {shelf.map((id, index) =>
            id ? (
              <button
                key={poolIds[index]}
                type="button"
                className="drag-handle pool__cell"
                aria-label={`牌庫 ${id}`}
                onPointerDown={(e) =>
                  onPointerDown(e, { from: 'pool', drinkId: id })
                }
              >
                <DrinkCard drinkId={id} size="pool" />
              </button>
            ) : draggingPoolId === poolIds[index] ? (
              <div
                key={poolIds[index]}
                className="pool__cell pool__source"
                aria-hidden="true"
              >
                <DrinkCard drinkId={poolIds[index]!} size="pool" dimmed />
              </div>
            ) : (
              <div
                key={poolIds[index] ?? index}
                className="pool__cell pool__hole"
                aria-hidden="true"
              />
            ),
          )}
        </div>
      </section>
      </div>

      <footer className="play-footer">
        <p
          className={`feedback${lastCorrect === null ? ' is-pending' : ' is-result'}`}
          data-testid="correct-count"
          aria-live="polite"
        >
          {lastCorrect === null
            ? '送出後會顯示全對格數'
            : `目前 ${lastCorrect} 個位置全對`}
        </p>
        <button
          type="button"
          className="btn btn--primary btn--block"
          data-testid="submit-guess"
          disabled={!full}
          onClick={submit}
        >
          送出
        </button>
      </footer>

      {drag?.active && draggingId && (
        <div
          className="drag-ghost"
          style={{ left: drag.x, top: drag.y }}
        >
          <DrinkCard drinkId={draggingId} size="ghost" />
        </div>
      )}

      {confirmRestart && (
        <ConfirmDialog
          title="回到設定？"
          message="目前進度會消失，計時也會中止。"
          confirmLabel="回到設定"
          cancelLabel="繼續玩"
          onCancel={() => setConfirmRestart(false)}
          onConfirm={onRestartSetup}
        />
      )}
    </main>
  )
}
