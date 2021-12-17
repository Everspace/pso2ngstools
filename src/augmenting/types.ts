import { AugmentImageType } from "./images/augment"
import { BigNumber } from "mathjs"

export interface AugmentStat {
  hp?: BigNumber
  pp?: BigNumber
  /** "Potency +#%" */
  potency?: BigNumber
  /** "Potency Floor Increase +#%" */
  floorPotency?: BigNumber
  meleePotency?: BigNumber
  rangedPotency?: BigNumber
  techPotency?: BigNumber
  /** "Damage Resistance +/-#%" */
  damageResist?: BigNumber
}

export const allAugmentStats: (keyof AugmentStat)[] = [
  "hp",
  "pp",
  "potency",
  "floorPotency",
  "meleePotency",
  "rangedPotency",
  "techPotency",
  "damageResist",
]

export const allAugmentCategories = [
  "basic",
  // "ward", TODO
  "domina",
  "soul",
  "note",
  "secreta",
  "dread",
  "gigas",
  // "element", TODO: They use the Special icon
  "dualble",
] as const

export type AugmentCategory = typeof allAugmentCategories[number]

export interface Augment {
  name: string
  category: AugmentCategory
  icon: AugmentImageType
  tier?: number
  baseName?: string
  location?: string
  rate: number
  stat: AugmentStat

  exchange?: Record<string, number>
}

export const resourceNames = [
  "Photon Quartz",
  "Photon Chunk",
  "Monotite",
  "Dualomite",
  "Trinite",
]

export type AugmentDisplayInfo = {
  name: string
  shortName?: string
  percent?: boolean
  Glyph?: React.ElementType
}
