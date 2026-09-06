/** Exact index matches only. Never scores "right item, wrong place". */
export function countCorrect(
  guess: readonly (string | null)[],
  answer: readonly string[],
): number {
  const n = Math.min(guess.length, answer.length)
  let correct = 0
  for (let i = 0; i < n; i++) {
    if (guess[i] !== null && guess[i] === answer[i]) {
      correct += 1
    }
  }
  return correct
}
