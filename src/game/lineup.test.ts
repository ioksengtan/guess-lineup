import { describe, expect, it } from 'vitest'
import { applyLineupDrop, poolSlots } from './lineup.ts'

const POOL = ['a', 'b', 'c', 'd']

describe('poolSlots', () => {
  it('starts as a fixed ordered shelf', () => {
    expect(poolSlots(POOL, [null, null])).toEqual(['a', 'b', 'c', 'd'])
  })

  it('leaves a hole at the original index instead of compacting', () => {
    expect(poolSlots(POOL, ['b', null])).toEqual(['a', null, 'c', 'd'])
    expect(poolSlots(POOL, ['b', 'd'])).toEqual(['a', null, 'c', null])
  })

  it('restores a returned card to the same index', () => {
    const afterPlace = applyLineupDrop([null, null], { from: 'pool', drinkId: 'b' }, {
      to: 'slot',
      index: 0,
    })
    expect(poolSlots(POOL, afterPlace)).toEqual(['a', null, 'c', 'd'])

    const afterReturn = applyLineupDrop(afterPlace, { from: 'slot', index: 0 }, {
      to: 'pool',
    })
    expect(poolSlots(POOL, afterReturn)).toEqual(['a', 'b', 'c', 'd'])
  })

  it('leaves a hole while a pool card is being dragged', () => {
    expect(poolSlots(POOL, [null, null], 'c')).toEqual(['a', 'b', null, 'd'])
  })
})

describe('applyLineupDrop', () => {
  it('places from pool and replace restores the displaced card to its hole', () => {
    const placed = applyLineupDrop([null, null], { from: 'pool', drinkId: 'a' }, {
      to: 'slot',
      index: 0,
    })
    expect(placed).toEqual(['a', null])
    expect(poolSlots(POOL, placed)).toEqual([null, 'b', 'c', 'd'])

    const replaced = applyLineupDrop(placed, { from: 'pool', drinkId: 'b' }, {
      to: 'slot',
      index: 0,
    })
    expect(replaced).toEqual(['b', null])
    expect(poolSlots(POOL, replaced)).toEqual(['a', null, 'c', 'd'])
  })

  it('swaps slots without duplicating or moving pool holes', () => {
    const next = applyLineupDrop(['a', 'b'], { from: 'slot', index: 0 }, {
      to: 'slot',
      index: 1,
    })
    expect(next).toEqual(['b', 'a'])
    expect(poolSlots(POOL, next)).toEqual([null, null, 'c', 'd'])
    expect(next.filter(Boolean)).toHaveLength(2)
  })
})
