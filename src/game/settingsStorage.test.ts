import { describe, expect, it } from 'vitest'
import { defaultSettings } from '../types.ts'
import {
  SETTINGS_STORAGE_KEY,
  loadSettings,
  normalizeSettings,
  saveSettings,
} from './settingsStorage.ts'

function memoryStorage(initial?: Record<string, string>) {
  const map = new Map(Object.entries(initial ?? {}))
  return {
    getItem: (key: string) => (map.has(key) ? map.get(key)! : null),
    setItem: (key: string, value: string) => {
      map.set(key, value)
    },
    dump: () => map,
  }
}

describe('normalizeSettings', () => {
  it('returns defaults for missing or unreadable values', () => {
    expect(normalizeSettings(undefined)).toEqual(defaultSettings())
    expect(normalizeSettings(null)).toEqual(defaultSettings())
    expect(normalizeSettings([])).toEqual(defaultSettings())
    expect(normalizeSettings('solo')).toEqual(defaultSettings())
    expect(normalizeSettings({ mode: 'coop' })).toEqual(defaultSettings())
  })

  it('clamps slots to 3–6 and pool size to 4–8, keeping pool ≥ slots', () => {
    expect(normalizeSettings({ slots: 1, poolSize: 2, mode: 'solo' })).toEqual({
      slots: 3,
      poolSize: 4,
      mode: 'solo',
    })
    expect(normalizeSettings({ slots: 9, poolSize: 99, mode: 'versus' })).toEqual({
      slots: 6,
      poolSize: 8,
      mode: 'versus',
    })
    expect(normalizeSettings({ slots: 6, poolSize: 4, mode: 'versus' })).toEqual({
      slots: 6,
      poolSize: 6,
      mode: 'versus',
    })
    expect(normalizeSettings({ slots: 4.6, poolSize: 5.2, mode: 'solo' })).toEqual({
      slots: 5,
      poolSize: 5,
      mode: 'solo',
    })
  })

  it('fills a partial record from defaults before clamping', () => {
    expect(normalizeSettings({ slots: 5 })).toEqual({
      slots: 5,
      poolSize: defaultSettings().poolSize,
      mode: 'solo',
    })
  })
})

describe('loadSettings / saveSettings', () => {
  it('restores the last slots, pool size, and mode', () => {
    const storage = memoryStorage()
    saveSettings({ slots: 3, poolSize: 8, mode: 'versus' }, storage)
    expect(loadSettings(storage)).toEqual({
      slots: 3,
      poolSize: 8,
      mode: 'versus',
    })
    expect(storage.dump().get(SETTINGS_STORAGE_KEY)).toBe(
      JSON.stringify({ slots: 3, poolSize: 8, mode: 'versus' }),
    )
  })

  it('uses defaults when nothing is stored or the payload is corrupt', () => {
    expect(loadSettings(memoryStorage())).toEqual(defaultSettings())
    expect(
      loadSettings(memoryStorage({ [SETTINGS_STORAGE_KEY]: '{oops' })),
    ).toEqual(defaultSettings())
    expect(
      loadSettings(memoryStorage({ [SETTINGS_STORAGE_KEY]: 'null' })),
    ).toEqual(defaultSettings())
  })

  it('clamps stored out-of-range values', () => {
    const storage = memoryStorage({
      [SETTINGS_STORAGE_KEY]: JSON.stringify({
        slots: 0,
        poolSize: 3,
        mode: 'versus',
      }),
    })
    expect(loadSettings(storage)).toEqual({
      slots: 3,
      poolSize: 4,
      mode: 'versus',
    })
  })

  it('uses defaults when reading throws, and ignores write failures', () => {
    const brokenRead = {
      getItem: () => {
        throw new Error('denied')
      },
      setItem: () => {},
    }
    expect(loadSettings(brokenRead)).toEqual(defaultSettings())

    const brokenWrite = {
      getItem: () => null,
      setItem: () => {
        throw new Error('quota')
      },
    }
    expect(() =>
      saveSettings({ slots: 4, poolSize: 6, mode: 'solo' }, brokenWrite),
    ).not.toThrow()
  })
})
