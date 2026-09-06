import { describe, expect, it } from 'vitest'
import { countCorrect } from './countCorrect.ts'

describe('countCorrect', () => {
  it('counts exact index matches only', () => {
    expect(countCorrect(['a', 'b', 'c'], ['a', 'b', 'c'])).toBe(3)
    expect(countCorrect(['c', 'b', 'a'], ['a', 'b', 'c'])).toBe(1)
    expect(countCorrect(['b', 'c', 'a'], ['a', 'b', 'c'])).toBe(0)
  })

  it('does not award right-item-wrong-place', () => {
    expect(countCorrect(['b', 'a', 'd', 'c'], ['a', 'b', 'c', 'd'])).toBe(0)
  })

  it('handles duplicates without double-counting across positions', () => {
    expect(countCorrect(['a', 'a', 'a'], ['a', 'b', 'a'])).toBe(2)
    expect(countCorrect(['a', 'b', 'a'], ['a', 'a', 'a'])).toBe(2)
  })

  it('ignores empty slots', () => {
    expect(countCorrect([null, 'b', 'c'], ['a', 'b', 'c'])).toBe(2)
    expect(countCorrect([null, null, null], ['a', 'b', 'c'])).toBe(0)
  })
})
