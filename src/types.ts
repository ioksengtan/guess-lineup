export type PlayMode = 'solo' | 'versus'

export type GameSettings = {
  slots: number
  poolSize: number
  mode: PlayMode
}

export const SLOT_MIN = 3
export const SLOT_MAX = 6
export const POOL_MIN = 4
export const POOL_MAX = 8
export const DEFAULT_SLOTS = 4
export const DEFAULT_POOL_SIZE = 6

export const defaultSettings = (): GameSettings => ({
  slots: DEFAULT_SLOTS,
  poolSize: DEFAULT_POOL_SIZE,
  mode: 'solo',
})
