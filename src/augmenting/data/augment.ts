import { AugmentImageType } from "../images/augment"
import basic from "./augments/basic.json"
import dread from "./augments/dread.json"
import note from "./augments/note.json"
import secreta from "./augments/secreta.json"
import soul from "./augments/soul.json"
import gigas from "./augments/gigas.json"

export interface AugmentStat {
  hp?: number
  pp?: number
  /** "Potency +#%" */
  potency?: number
  /** "Potency Floor Increase +#%" */
  floorPotency?: number
  meleePotency?: number
  rangedPotency?: number
  techPotency?: number
  /** "Damage Resistance +/-#%" */
  damageResist?: number
}

export const allAugmentCategories = [
  "basic",
  // "ward", TODO
  "soul",
  "note",
  "secreta",
  "dread",
  "gigas",
  // "element", TODO: They use the Special icon
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

export const allAugments = [
  ...basic,
  ...dread,
  ...note,
  ...secreta,
  ...soul,
  ...gigas,
] as Array<Augment>

export const sumAugmentStats = (augments: Augment[]) =>
  augments.reduce<AugmentStat>((memory, { stat }) => {
    Object.keys(stat).forEach((statName) => {
      const key = statName as keyof AugmentStat
      let value = memory[key]
      if (!value) memory[key] = 0
      memory[key] = memory[key]! + stat[key]!
    })
    return memory
  }, {})

export const simplifyAugmentStat = (stats: AugmentStat): AugmentStat => {
  const potency = stats?.potency ?? 0
  let meleePotency = (stats?.meleePotency ?? 0) + potency
  let rangedPotency = (stats?.rangedPotency ?? 0) + potency
  let techPotency = (stats?.techPotency ?? 0) + potency

  const compoundStat: AugmentStat = {
    ...stats,
    meleePotency,
    rangedPotency,
    techPotency,
  }
  delete compoundStat.potency
  return compoundStat
}
