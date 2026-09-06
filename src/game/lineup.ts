import type { DragPayload, DropTarget } from '../drag/types.ts'

export function remainingPoolIds(
  poolIds: readonly string[],
  guess: readonly (string | null)[],
  draggingPoolId?: string | null,
): string[] {
  const used = new Set(
    guess.filter((id): id is string => id !== null && id !== ''),
  )
  if (draggingPoolId) used.add(draggingPoolId)
  return poolIds.filter((id) => !used.has(id))
}

/** One physical card per id: place/replace/swap/return without duplicating. */
export function applyLineupDrop(
  guess: readonly (string | null)[],
  payload: DragPayload,
  target: DropTarget,
): (string | null)[] {
  const next = [...guess]
  if (payload.from === 'pool' && target.to === 'slot') {
    const already = next.findIndex((id) => id === payload.drinkId)
    if (already !== -1) next[already] = null
    next[target.index] = payload.drinkId
    return next
  }
  if (payload.from === 'slot' && target.to === 'pool') {
    next[payload.index] = null
    return next
  }
  if (payload.from === 'slot' && target.to === 'slot' && payload.index !== target.index) {
    const tmp = next[payload.index] ?? null
    next[payload.index] = next[target.index] ?? null
    next[target.index] = tmp
    return next
  }
  return next
}
