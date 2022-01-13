import { one, zero } from "MathConstants"
import {
  AllAttackIcons,
  ATKOutlineIcon,
  DEFOutlineIcon,
  MeleeIcon,
  RangeIcon,
  TechIcon,
} from "./images/icon"
import { AugmentStat, AugmentDisplayInfo, AugmentableSlot } from "./types"

export const augmentStatToDisplayInfo: Record<
  keyof AugmentStat,
  AugmentDisplayInfo
> = {
  bp: {
    name: "BP",
  },
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

export const augmentSlotNiceName: Record<AugmentableSlot, string> = {
  weapon: "Weapon",
  unit1: "Unit 1",
  unit2: "Unit 2",
  unit3: "Unit 3",
}

export function augmentValueToString(
  statName: keyof AugmentStat,
  value: math.BigNumber,
): string {
  const { percent } = augmentStatToDisplayInfo[statName]

  if (!percent) {
    return value.toString()
  }

  // Damage and status resist are
  // actually (1-display) internally (0.98 for 2% resist)
  switch (statName) {
    case "damageResist":
    case "statusResist":
      return `${one.minus(value).mul(100).toFixed(2)}%`
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
