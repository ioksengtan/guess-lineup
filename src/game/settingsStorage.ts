import {
  POOL_MAX,
  POOL_MIN,
  SLOT_MAX,
  SLOT_MIN,
  defaultSettings,
  type GameSettings,
  type PlayMode,
} from '../types.ts'

export const SETTINGS_STORAGE_KEY = 'guess-lineup.settings'

type StorageLike = Pick<Storage, 'getItem' | 'setItem'>

function browserStorage(): StorageLike | undefined {
  try {
    if (typeof localStorage === 'undefined') return undefined
    return localStorage
  } catch {
    return undefined
  }
}

function clampInt(
  value: unknown,
  min: number,
  max: number,
  fallback: number,
): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback
  return Math.min(max, Math.max(min, Math.round(value)))
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/** Clamp slots, pool size, and mode. Unreadable shapes fall back to defaults. */
export function normalizeSettings(input: unknown): GameSettings {
  const defaults = defaultSettings()
  if (!isRecord(input)) return defaults

  const slots = clampInt(input.slots, SLOT_MIN, SLOT_MAX, defaults.slots)
  let poolSize = clampInt(input.poolSize, POOL_MIN, POOL_MAX, defaults.poolSize)
  if (poolSize < slots) poolSize = slots

  const mode: PlayMode =
    input.mode === 'solo' || input.mode === 'versus' ? input.mode : defaults.mode

  return { slots, poolSize, mode }
}

export function loadSettings(storage: StorageLike | undefined = browserStorage()): GameSettings {
  if (!storage) return defaultSettings()
  try {
    const raw = storage.getItem(SETTINGS_STORAGE_KEY)
    if (raw == null || raw === '') return defaultSettings()
    return normalizeSettings(JSON.parse(raw))
  } catch {
    return defaultSettings()
  }
}

export function saveSettings(
  settings: GameSettings,
  storage: StorageLike | undefined = browserStorage(),
): void {
  if (!storage) return
  try {
    storage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(normalizeSettings(settings)))
  } catch {
    // Private mode or quota: keep the in-memory settings for this visit.
  }
}
