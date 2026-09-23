export type DragPayload =
  | { from: 'pool'; drinkId: string }
  | { from: 'slot'; index: number }

export type DropTarget = { to: 'slot'; index: number } | { to: 'pool' }

export type DragSession = {
  payload: DragPayload
  pointerId: number
  originX: number
  originY: number
  x: number
  y: number
  /** Past the movement threshold; a tap does not count as a drag. */
  active: boolean
  over: DropTarget | null
}
