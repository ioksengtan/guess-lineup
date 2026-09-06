import type { DragPayload, DropTarget } from '../drag/types.ts'

/** Fixed-length pool shelf: placed/dragging cards leave a hole at the same index. */
export function poolSlots(
  poolIds: readonly string[],
  guess: readonly (string | null)[],
  draggingPoolId?: string | null,
): (string | null)[] {
  const used = new Set(
    guess.filter((id): id is string => id !== null && id !== ''),
  )
  if (draggingPoolId) used.add(draggingPoolId)
  return poolIds.map((id) => (used.has(id) ? null : id))
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
