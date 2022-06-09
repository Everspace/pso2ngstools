import { AugmentImageType } from "./images/augment"
import { BigNumber } from "mathjs"

export const augmentSlots = ["weapon", "unit1", "unit2", "unit3"] as const
export type AugmentableSlot = typeof augmentSlots[number]

export type UnitSlot = Exclude<AugmentableSlot, "weapon">
export const unitSlots: UnitSlot[] = ["unit1", "unit2", "unit3"]

export const GRIND_LEVELS = [0, 10, 20, 30, 40, 50] as const
export type GrindLevel = typeof GRIND_LEVELS[number]
export const GRIND_KEYS = GRIND_LEVELS.map(
  (id) => `Grind${id}`,
) as `Grind${GrindLevel}`[]
export const MAX_GRIND: GrindLevel = GRIND_LEVELS[GRIND_LEVELS.length - 1]

export interface AugmentStat {
  bp?: BigNumber
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
  "bp",
  "hp",
  "pp",
  "potency",
  "floorPotency",
  "meleePotency",
  "rangedPotency",
  "techPotency",
  "damageResist",
]

// Arranged such that it's nice to use
export const allAugmentCategories = [
  "unknown",
  "might",
  "precision",
  "technique",
  "addi",
  "domina",
  "dread",
  "dualble",
  "element",
  "fusia",
  "gigas",
  "note",
  "secreta",
  "soul",
  "tria",
  "ward",
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

export type Unit = {
  name: string
  level: number
  stars: number
  limit: GrindLevel
  grindValues: Record<GrindLevel, BigNumber>
  stat: AugmentStat
}

export type Weapon = {
  name: string
  level: number
  stars: number
  limit: GrindLevel
  grindValues: Record<GrindLevel, BigNumber>
  element?: string // TODO: add all the valid elements
  /**
   * Default 70
   */
  varianceLow: BigNumber
  /**
   * Default 100
   */
  varianceHigh: BigNumber
}

export const allClasses = [
  "Hu",
  "Fi",
  "Ra",
  "Gu",
  "Fo",
  "Te",
  "Br",
  "Bo",
] as const

export type ClassAbbreviation = typeof allClasses[number]

export type ClassLevel = {
  hp?: number
  attack: number
  defense: number
}

export type ClassData = Record<ClassAbbreviation, ClassLevel[]>
export type CombatActivityType = "UQ" | "Battle Area"

export type CombatActivity = {
  name: string
  region: string
  type: CombatActivityType
  rank: number
  bp: number
}
