import { one, zero } from "MathConstants"
import {
  AllAttackIcons,
  ATKOutlineIcon,
  DEFOutlineIcon,
  MeleeIcon,
  RangeIcon,
  TechIcon,
} from "./images/icon"
import { AugmentStat, AugmentDisplayInfo } from "./types"

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
  conditionalPotency: {
    name: "Potency (Conditional)",
    percent: true,
  },
  statusResist: {
    name: "Status Resist",
    percent: true,
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
