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
import * as math from "mathjs"
import { one, zero } from "MathConstants"

export interface AugmentStat {
  hp?: math.BigNumber
  pp?: math.BigNumber
  /** "Potency +#%" */
  potency?: math.BigNumber
  /** "Potency Floor Increase +#%" */
  floorPotency?: math.BigNumber
  meleePotency?: math.BigNumber
  rangedPotency?: math.BigNumber
  techPotency?: math.BigNumber
  /** "Damage Resistance +/-#%" */
  damageResist?: math.BigNumber
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
        newAug[key] = math.bignumber(augment.stat[key]!)
        break
      default:
        newAug[key] = math.bignumber(augment.stat[key]!).dividedBy(100).add(1)
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
  ] as unknown as Augment[]
).flatMap(toAugmentReal)

export const augmentByCategory = groupBy(
  allAugments,
  (augment) => augment.category,
)
//  as Record<AugmentCategory, Augment[]>

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
          memory[key] = (memory[key] ?? zero).add(stat[key]!)
          break
        default:
          if (memory[key] === undefined) {
            memory[key] = math.bignumber(stat[key])
            return
          }
          memory[key] = memory[key]!.mul(stat[key]!)
      }
    })
    return memory
  }, {})

export const simplifyAugmentStat = (stats: AugmentStat): AugmentStat => {
  const potency = stats?.potency ?? zero
  let meleePotency = stats?.meleePotency ?? zero
  let rangedPotency = stats?.rangedPotency ?? zero
  let techPotency = stats?.techPotency ?? zero
  if (potency.greaterThan(zero)) {
    meleePotency = meleePotency.greaterThan(zero)
      ? meleePotency.mul(potency)
      : potency
    rangedPotency = rangedPotency.greaterThan(zero)
      ? rangedPotency.mul(potency)
      : potency
    techPotency = techPotency.greaterThan(zero)
      ? techPotency.mul(potency)
      : potency
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

export function augmentValueToString(
  statName: keyof AugmentStat,
  value: math.BigNumber,
): string {
  switch (statName) {
    case "hp":
    case "pp":
      return value.toString()
    default:
      // > 1 since all - effects are from 1
      const symbol = value.greaterThanOrEqualTo(1) ? "+" : "-"
      // Handle negative
      let transformValue: math.BigNumber = zero
      if (value.greaterThanOrEqualTo(1)) {
        transformValue = value.minus(1)
      } else {
        transformValue = one.minus(value)
      }

      return symbol + transformValue.mul(100).toFixed(2)

    // return symbol + round(transformValue, 2).toString()
  }
}

export function augmentFufillsRequirement(
  aug: Augment,
  atLeast: AugmentStat,
): boolean {
  const stats = aug.stat
  const keys = Object.keys(stats) as (keyof AugmentStat)[]
  const needed = Object.keys(atLeast) as (keyof AugmentStat)[]

  const hasAllKeys = needed.every((need) => keys.includes(need))
  if (!hasAllKeys) return false

  const hasAllStatMins = needed.every((need) =>
    stats[need]!.greaterThanOrEqualTo(atLeast[need]!),
  )

  return hasAllStatMins
}
