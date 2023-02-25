import { one, zero } from "MathConstants"
import { WeaponRange } from "./tools"
import { AugmentableSlot, AugmentDisplayInfo, AugmentStat } from "./types"

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
  },
  floorPotency: {
    name: "Potency Floor Increase",
    percent: true,
  },
  damageResist: {
    name: "Damage Resistance",
    percent: true,
  },
  meleePotency: {
    name: "Melee Potency",
    shortName: "MATK",
    percent: true,
  },
  rangedPotency: {
    name: "Ranged Potency",
    shortName: "RATK",
    percent: true,
  },
  techPotency: {
    name: "Technique Potency",
    shortName: "TATK",
    percent: true,
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

export function rangeToLine({ min, max }: WeaponRange): string {
  return `${min.mul(100).toFixed(1)}% - ${max.mul(100).toFixed(1)}%`
}
