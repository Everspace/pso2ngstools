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

  /** Like the element exploit */
  conditionalPotency?: BigNumber

  /** Comprehensive */
  statusResist?: BigNumber

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
  "ward",
  "domina",
  "soul",
  "note",
  "secreta",
  "dread",
  "gigas",
  "element",
  "dualble",
] as const

export type AugmentCategory = typeof allAugmentCategories[number]

export interface Augment {
  name: string
  category: AugmentCategory
  icon: AugmentImageType
  bp?: number
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

export type Unit = {
  name: string
  level: number
  stars: number
  defenseBase: number
  defenseMax: number
  stat: AugmentStat
}

export type Weapon = {
  name: string
  level: number
  stars: number
  attackBase: number
  attackMax: number
  element?: string // TODO: add all the valid elements
  /**
   * Default 70
   */
  varianceLow?: number
  /**
   * Default 100
   */
  varianceHigh?: number
}
