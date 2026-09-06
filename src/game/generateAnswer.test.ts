import { describe, expect, it } from 'vitest'
import { getPoolIds } from '../drinks.ts'
import { generateAnswer } from './generateAnswer.ts'

const SAMPLE_POOL = getPoolIds(6)

describe('generateAnswer', () => {
  it('is stable for the same seed, slots, and pool', () => {
    const a = generateAnswer(12345, 4, SAMPLE_POOL)
    const b = generateAnswer(12345, 4, SAMPLE_POOL)
    expect(a).toEqual(b)
    expect(a).toHaveLength(4)
  })

  it('returns the same known lineup for a fixed seed', () => {
    expect(generateAnswer(1, 4, SAMPLE_POOL)).toEqual([
      'monster-ultra-sunrise',
      'ghost-orange-cream',
      'prime-ice-pop',
      'peace-tea',
    ])
  })

  it('only picks ids from the given pool prefix', () => {
    const pool = getPoolIds(6)
    const answer = generateAnswer(99, 4, pool)
    expect(answer.every((id) => pool.includes(id))).toBe(true)
    expect(answer).toHaveLength(4)
  })

  it('never repeats an id in the answer', () => {
    for (let seed = 0; seed < 200; seed++) {
      const answer = generateAnswer(seed, 4, SAMPLE_POOL)
      expect(new Set(answer).size).toBe(answer.length)
    }
  })

  it('throws when slots exceed pool size', () => {
    expect(() => generateAnswer(1, 5, ['a', 'b'])).toThrow()
  })

  it('changes when seed changes', () => {
    const a = generateAnswer(1, 4, SAMPLE_POOL)
    const b = generateAnswer(2, 4, SAMPLE_POOL)
    expect(a).not.toEqual(b)
  })

  it('changes when pool prefix changes', () => {
    const shortPool = getPoolIds(4)
    const longPool = getPoolIds(8)
    const a = generateAnswer(42, 4, shortPool)
    const b = generateAnswer(42, 4, longPool)
    expect(a.every((id) => shortPool.includes(id))).toBe(true)
    expect(b.every((id) => longPool.includes(id))).toBe(true)
    expect(a).not.toEqual(b)
  })
})
