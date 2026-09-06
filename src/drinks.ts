export type Drink = {
  id: string
  name: string
  shortName: string
  hue: string
  accent: string
  art: 'can' | 'bottle' | 'placeholder'
}

/** Fixed ordered catalog. Pool is the first `poolSize` ids (D3). Index 8 = P1 (D4). */
export const DRINKS: readonly Drink[] = [
  {
    id: 'ghost-orange-cream',
    name: 'Ghost 橙奶霜',
    shortName: 'Ghost',
    hue: '#f4a24a',
    accent: '#fff4e0',
    art: 'can',
  },
  {
    id: 'prime-orange',
    name: 'Prime 橙',
    shortName: 'Prime橙',
    hue: '#ff6b00',
    accent: '#1a1a1a',
    art: 'bottle',
  },
  {
    id: 'crush-orange',
    name: 'Crush 橙',
    shortName: 'Crush',
    hue: '#ff8a00',
    accent: '#ffffff',
    art: 'can',
  },
  {
    id: 'monster-ultra-sunrise',
    name: 'Monster 日出',
    shortName: 'Monster',
    hue: '#e85d04',
    accent: '#d0d0d0',
    art: 'can',
  },
  {
    id: 'prime-ice-pop',
    name: 'Prime 冰棒',
    shortName: 'Prime冰棒',
    hue: '#ff5a6a',
    accent: '#ffffff',
    art: 'bottle',
  },
  {
    id: 'peace-tea',
    name: 'Peace Tea',
    shortName: 'Peace',
    hue: '#ffcba4',
    accent: '#3d2b1f',
    art: 'can',
  },
  {
    id: 'gatorade-orange',
    name: 'Gatorade 橙',
    shortName: 'Gatorade',
    hue: '#ff6600',
    accent: '#e8e8e8',
    art: 'bottle',
  },
  {
    id: 'p1',
    name: 'P1',
    shortName: 'P1',
    hue: '#c8c8c8',
    accent: '#444444',
    art: 'placeholder',
  },
] as const

export const DRINK_IDS = DRINKS.map((d) => d.id)

export function getPoolIds(poolSize: number): string[] {
  return DRINK_IDS.slice(0, poolSize)
}

export function getDrink(id: string): Drink {
  return DRINKS.find((d) => d.id === id) ?? DRINKS[DRINKS.length - 1]!
}
