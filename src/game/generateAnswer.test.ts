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
      'monster-ultra-sunrise',
      'peace-tea',
    ])
  })

  it('only picks ids from the given pool prefix', () => {
    const pool = getPoolIds(4)
    const answer = generateAnswer(99, 6, pool)
    expect(answer.every((id) => pool.includes(id))).toBe(true)
    expect(answer).toHaveLength(6)
  })

  it('allows duplicates in the answer (D1)', () => {
    let found = false
    for (let seed = 0; seed < 200; seed++) {
      const answer = generateAnswer(seed, 6, ['a', 'b'])
      if (new Set(answer).size < answer.length) {
        found = true
        break
      }
    }
    expect(found).toBe(true)
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
