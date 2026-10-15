export type SubmitHistoryEntry = {
  id: number
  lineup: readonly string[]
  correctCount: number
}

/** Newest first. The row stores the arrangement and the count N only. */
export function recordSubmit(
  history: readonly SubmitHistoryEntry[],
  lineup: readonly string[],
  correctCount: number,
): SubmitHistoryEntry[] {
  const id = (history[0]?.id ?? 0) + 1
  return [
    {
      id,
      lineup: [...lineup],
      correctCount,
    },
    ...history,
  ]
}

export function clearSubmitHistory(): SubmitHistoryEntry[] {
  return []
}

export function formatSubmitHistoryTitle(count: number): string {
  return `送出紀錄（共 ${count} 次）`
}

/** Visible feedback for one submit. Never names which slots matched. */
export function formatCorrectCountLabel(correctCount: number): string {
  return `${correctCount} 個位置全對`
}

export function presentSubmitEntry(entry: SubmitHistoryEntry): {
  lineup: readonly string[]
  label: string
} {
  return {
    lineup: entry.lineup,
    label: formatCorrectCountLabel(entry.correctCount),
  }
}
