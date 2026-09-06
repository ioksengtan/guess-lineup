import { describe, expect, it } from 'vitest'
import { applyLineupDrop, remainingPoolIds } from './lineup.ts'

const POOL = ['a', 'b', 'c', 'd']

describe('remainingPoolIds', () => {
  it('starts with the full ordered pool', () => {
    expect(remainingPoolIds(POOL, [null, null])).toEqual(POOL)
  })

  it('removes placed cards and restores them when cleared', () => {
    expect(remainingPoolIds(POOL, ['b', null])).toEqual(['a', 'c', 'd'])
    expect(remainingPoolIds(POOL, [null, null])).toEqual(POOL)
  })

  it('hides a pool card while it is being dragged', () => {
    expect(remainingPoolIds(POOL, [null, null], 'c')).toEqual(['a', 'b', 'd'])
  })
})

describe('applyLineupDrop', () => {
  it('places from pool and replace returns the displaced card to the pool', () => {
    const placed = applyLineupDrop([null, null], { from: 'pool', drinkId: 'a' }, {
      to: 'slot',
      index: 0,
    })
    expect(placed).toEqual(['a', null])
    expect(remainingPoolIds(POOL, placed)).toEqual(['b', 'c', 'd'])

    const replaced = applyLineupDrop(placed, { from: 'pool', drinkId: 'b' }, {
      to: 'slot',
      index: 0,
    })
    expect(replaced).toEqual(['b', null])
    expect(remainingPoolIds(POOL, replaced)).toEqual(['a', 'c', 'd'])
  })

  it('returns a slot card to the pool', () => {
    const next = applyLineupDrop(['a', 'b'], { from: 'slot', index: 1 }, { to: 'pool' })
    expect(next).toEqual(['a', null])
    expect(remainingPoolIds(POOL, next)).toEqual(['b', 'c', 'd'])
  })

  it('swaps slots without duplicating cards', () => {
    const next = applyLineupDrop(['a', 'b'], { from: 'slot', index: 0 }, {
      to: 'slot',
      index: 1,
    })
    expect(next).toEqual(['b', 'a'])
    expect(remainingPoolIds(POOL, next)).toEqual(['c', 'd'])
    expect(next.filter(Boolean)).toHaveLength(2)
  })
})
