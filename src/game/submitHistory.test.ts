import { describe, expect, it } from 'vitest'
import {
  clearSubmitHistory,
  formatCorrectCountLabel,
  formatSubmitHistoryTitle,
  presentSubmitEntry,
  recordSubmit,
  type SubmitHistoryEntry,
} from './submitHistory.ts'

describe('submitHistory', () => {
  it('records each submit newest first without rewriting older rows', () => {
    const lineup = ['a', 'b', 'c']
    const first = recordSubmit([], lineup, 0)
    lineup[0] = 'z'

    const second = recordSubmit(first, ['c', 'b', 'a'], 1)

    expect(first).toHaveLength(1)
    expect(first[0]?.lineup).toEqual(['a', 'b', 'c'])
    expect(second.map((entry) => entry.correctCount)).toEqual([1, 0])
    expect(second[0]?.lineup).toEqual(['c', 'b', 'a'])
    expect(second[1]?.lineup).toEqual(['a', 'b', 'c'])
  })

  it('clears the in-memory list so the next round starts empty', () => {
    const history = recordSubmit(
      recordSubmit([], ['a', 'b'], 1),
      ['b', 'a'],
      0,
    )
    const cleared = clearSubmitHistory()

    expect(history).toHaveLength(2)
    expect(cleared).toEqual([])
    expect(formatSubmitHistoryTitle(cleared.length)).toBe('送出紀錄（共 0 次）')

    const nextRound = recordSubmit(cleared, ['b', 'a'], 0)
    expect(nextRound).toHaveLength(1)
    expect(nextRound[0]).toMatchObject({ lineup: ['b', 'a'], correctCount: 0 })
  })

  it('stores and labels only N, not which positions match', () => {
    const history = recordSubmit([], ['c', 'b', 'a'], 1)
    const entry = history[0] as SubmitHistoryEntry
    const presented = presentSubmitEntry(entry)
    const payloadKeys = Object.keys(entry)
      .filter((key) => key !== 'id')
      .sort()

    expect(entry.correctCount).toBe(1)
    expect(payloadKeys).toEqual(['correctCount', 'lineup'])
    expect(entry).not.toHaveProperty('matches')
    expect(entry).not.toHaveProperty('positions')
    expect(entry).not.toHaveProperty('correctIndexes')
    expect(presented).toEqual({
      lineup: ['c', 'b', 'a'],
      label: '1 個位置全對',
    })
    expect(formatCorrectCountLabel(entry.correctCount)).toBe('1 個位置全對')
    expect(presented.label).not.toMatch(/第\s*\d+\s*格/)
    expect(JSON.stringify(presented)).not.toMatch(/true|false/)
  })
})
