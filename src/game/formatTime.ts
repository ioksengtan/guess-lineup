export function formatTime(ms: number): string {
  const seconds = Math.max(0, ms) / 1000
  return seconds.toFixed(2)
}
