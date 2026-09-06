import { mulberry32 } from './mulberry32.ts'

/**
 * Pure answer generator. Duplicates are allowed (D1).
 * Same (seed, slots, poolIds) always returns the same lineup.
 */
export function generateAnswer(
  seed: number,
  slots: number,
  poolIds: readonly string[],
): string[] {
  if (slots < 1) {
    throw new Error('slots must be >= 1')
  }
  if (poolIds.length === 0) {
    throw new Error('poolIds must be non-empty')
  }
  const rand = mulberry32(seed >>> 0)
  const answer: string[] = []
  for (let i = 0; i < slots; i++) {
    const index = Math.floor(rand() * poolIds.length)
    answer.push(poolIds[index]!)
  }
  return answer
}

export function createSeed(): number {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    return crypto.getRandomValues(new Uint32Array(1))[0]!
  }
  return (Math.random() * 0x1_0000_0000) >>> 0
}
