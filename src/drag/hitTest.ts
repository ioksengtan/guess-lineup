import type { DropTarget } from './types.ts'

export function hitTestDropTarget(
  x: number,
  y: number,
  root: ParentNode | null,
): DropTarget | null {
  if (!root || typeof document === 'undefined') return null
  const stack = document.elementsFromPoint(x, y)
  for (const el of stack) {
    if (!(el instanceof Element)) continue
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
