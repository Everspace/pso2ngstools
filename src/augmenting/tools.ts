import { bignumber } from "mathjs"
import { one, zero } from "../MathConstants"
import { Augment, AugmentStat, Unit } from "./types"

export const augmentTierToRoman = [
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
]

/**
 * Mutates augmentStat to turn "percents" into actual numbers
 */
export function toAugmentStatReal(stat: AugmentStat): AugmentStat {
  const newAug: AugmentStat = {}
  Object.keys(stat).forEach((statName) => {
    const key = statName as keyof AugmentStat
    switch (key) {
      case "hp":
      case "pp":
        newAug[key] = bignumber(stat[key]!)
        break
      // Damage and status resist are
      // actually (1-display) internally (0.98 for 2% resist)
      case "damageResist":
      case "statusResist":
        newAug[key] = one.minus(bignumber(stat[key]!).dividedBy(100))
        break
      default:
        newAug[key] = bignumber(stat[key]!).dividedBy(100).add(1)
    }
  })
  return newAug
}

export const toUnitReal = (unit: Unit): Unit => {
  unit.stat = toAugmentStatReal(unit.stat)
  return unit
}

export const toAugmentReal = (augment: Augment): Augment => {
  augment.stat = toAugmentStatReal(augment.stat)
  return augment
}

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
            memory[key] = bignumber(stat[key])
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

export function augmentFufillsRequirement(
  aug: Augment,
  atLeast: AugmentStat,
): boolean {
  const stats = simplifyAugmentStat(aug.stat)
  const keys = Object.keys(stats) as (keyof AugmentStat)[]
  const needed = Object.keys(atLeast) as (keyof AugmentStat)[]

  const hasAllKeys = needed.every((need) => keys.includes(need))
  if (!hasAllKeys) return false

  const hasAllStatMins = needed.every((need) =>
    stats[need]!.greaterThanOrEqualTo(atLeast[need]!),
  )

  return hasAllStatMins
}
