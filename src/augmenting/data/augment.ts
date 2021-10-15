import { AugmentImageType } from "../images/augment"
import basic from "./augments/basic.json"
import dread from "./augments/dread.json"
import domina from "./augments/domina.json"
import note from "./augments/note.json"
import secreta from "./augments/secreta.json"
import soul from "./augments/soul.json"
import gigas from "./augments/gigas.json"
import dualble from "./augments/dualble.json"
import { groupBy } from "lodash"

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

/**
 * Mutates augment to turn "percents" into actual numbers
 */
export const toAugmentReal = (augment: Augment): Augment => {
  const newAug: AugmentStat = { ...augment.stat }
  Object.keys(augment.stat).forEach((statName) => {
    const key = statName as keyof AugmentStat
    switch (key) {
      case "hp":
      case "pp":
        newAug[key] = augment.stat[key]!
        break
      default:
        newAug[key] = 1 + augment.stat[key]! / 100
    }
  })
  augment.stat = newAug
  return augment
}

export const resourceNames = [
  "Photon Quartz",
  "Photon Chunk",
  "Monotite",
  "Dualomite",
  "Trinite",
]

export const allAugments = (
  [
    ...basic,
    ...dread,
    ...domina,
    ...note,
    ...secreta,
    ...soul,
    ...gigas,
    ...dualble,
  ] as Array<Augment>
).flatMap(toAugmentReal)

export const augmentByCategory = groupBy(
  allAugments,
  (augment) => augment.category,
) as Record<AugmentCategory, Augment[]>

export const augmentByBasename = groupBy(
  allAugments,
  (augment) => augment.baseName,
)

export const sumAugmentStats = (augments: Augment[]) =>
  augments.reduce<AugmentStat>((memory, { stat }) => {
    Object.keys(stat).forEach((statName) => {
      const key = statName as keyof AugmentStat
      switch (key) {
        case "hp":
        case "pp":
          memory[key] = (memory[key] ?? 0) + stat[key]!
          break
        default:
          if (memory[key] === undefined) {
            memory[key] = stat[key]
            return
          }
          memory[key] = memory[key]! * stat[key]!
      }
    })
    return memory
  }, {})

export const simplifyAugmentStat = (stats: AugmentStat): AugmentStat => {
  const potency = stats?.potency ?? 0
  let meleePotency = stats?.meleePotency ?? 0
  let rangedPotency = stats?.rangedPotency ?? 0
  let techPotency = stats?.techPotency ?? 0
  if (potency > 0) {
    meleePotency = meleePotency > 0 ? meleePotency * potency : potency
    rangedPotency = rangedPotency > 0 ? rangedPotency * potency : potency
    techPotency = techPotency > 0 ? techPotency * potency : potency
  }
  const compoundStat: AugmentStat = {
    ...stats,
    meleePotency,
    rangedPotency,
    techPotency,
  }
  delete compoundStat.potency
  return compoundStat
}
