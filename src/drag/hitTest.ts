import type { DropTarget } from './types.ts'

function hitTestPoint(
  x: number,
  y: number,
  root: ParentNode,
): DropTarget | null {
  const stack = document.elementsFromPoint(x, y)
  for (const el of stack) {
    if (!(el instanceof Element)) continue
    if (el.closest('.drag-ghost')) continue
    const node = el.closest('[data-drop]')
    if (!node || !root.contains(node)) continue
    const kind = node.getAttribute('data-drop')
    if (kind === 'pool') return { to: 'pool' }
    if (kind === 'slot') {
      const index = Number(node.getAttribute('data-slot-index'))
      if (Number.isInteger(index)) return { to: 'slot', index }
    }
  }
  return null
}

/** Hit-test the finger, then a small cross if the point falls in a gap. */
export function hitTestDropTarget(
  x: number,
  y: number,
  root: ParentNode | null,
): DropTarget | null {
  if (!root || typeof document === 'undefined') return null
  const direct = hitTestPoint(x, y, root)
  if (direct) return direct
  const slop = 12
  const offsets: Array<[number, number]> = [
    [0, -slop],
    [0, slop],
    [-slop, 0],
    [slop, 0],
  ]
  for (const [dx, dy] of offsets) {
    const hit = hitTestPoint(x + dx, y + dy, root)
    if (hit) return hit
  }
  return null
}
