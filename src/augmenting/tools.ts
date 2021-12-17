import { bignumber } from "mathjs"
import { one, zero } from "MathConstants"
import {
  AllAttackIcons,
  ATKOutlineIcon,
  DEFOutlineIcon,
  MeleeIcon,
  RangeIcon,
  TechIcon,
} from "augmenting/images/icon"
import { Augment, AugmentDisplayInfo, AugmentStat } from "./types"

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
        newAug[key] = bignumber(augment.stat[key]!)
        break
      default:
        newAug[key] = bignumber(augment.stat[key]!).dividedBy(100).add(1)
    }
  })
  augment.stat = newAug
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

export const augmentStatToDisplayInfo: Record<
  keyof AugmentStat,
  AugmentDisplayInfo
> = {
  hp: {
    name: "HP",
  },
  pp: {
    name: "PP",
  },
  potency: {
    name: "Potency",
    percent: true,
    Glyph: AllAttackIcons,
  },
  floorPotency: {
    name: "Potency Floor Increase",
    percent: true,
    Glyph: ATKOutlineIcon,
  },
  damageResist: {
    name: "Damage Resistance",
    percent: true,
    Glyph: DEFOutlineIcon,
  },
  meleePotency: {
    name: "Melee Potency",
    shortName: "MATK",
    percent: true,
    Glyph: MeleeIcon,
  },
  rangedPotency: {
    name: "Ranged Potency",
    shortName: "RATK",
    percent: true,
    Glyph: RangeIcon,
  },
  techPotency: {
    name: "Technique Potency",
    shortName: "TATK",
    percent: true,
    Glyph: TechIcon,
  },
}

export function augmentValueToString(
  statName: keyof AugmentStat,
  value: math.BigNumber,
): string {
  const { percent } = augmentStatToDisplayInfo[statName]

  if (!percent) {
    return value.toString()
  }

  // > 1 since all - effects are from 1
  const symbol = value.greaterThanOrEqualTo(1) ? "+" : "-"
  // Handle negative
  let transformValue: math.BigNumber = zero
  if (value.greaterThanOrEqualTo(1)) {
    transformValue = value.minus(1)
  } else {
    transformValue = one.minus(value)
  }
  return `${symbol}${transformValue.mul(100).toFixed(2)}%`
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
