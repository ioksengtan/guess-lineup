export type DragPayload =
  | { from: 'pool'; drinkId: string }
  | { from: 'slot'; index: number }

export type DropTarget = { to: 'slot'; index: number } | { to: 'pool' }

export type DragSession = {
  payload: DragPayload
  x: number
  y: number
  over: DropTarget | null
}
