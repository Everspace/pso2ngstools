import {
  Augment,
  AugmentableSlot,
  ClassLevel,
  GrindLevel,
  Unit,
  unitSlots,
} from "augmenting/types"
import { atom } from "jotai"
import { atomFamily } from "jotai/utils"
import { zero } from "MathConstants"
import { BigNumber, bignumber } from "mathjs"
import { allAugmentsAtom, augmentableFamily } from "./augmentableState"
import { classInfoAtom, skillpointAtom } from "./characterState"
import {
  grindStateFamily,
  unitStateFamily,
  WeaponEquipState,
  weaponStateAtom,
} from "./equipmentState"

function getDefenseBp(def: BigNumber | number): BigNumber {
  let d
  if (typeof def == "number") d = bignumber(def)
  else d = def
  return d.div(2)
}

function getUnitBp(unit: Unit, grind: GrindLevel) {
  const {
    stat: { hp, pp },
  } = unit
  const def = unit.grindValues[grind]
  const hpBp = (hp ?? zero).div(10)
  const ppBp = pp ?? 0
  const defBp = getDefenseBp(def)

  return { defBp, statBp: zero.add(hpBp).add(ppBp) }
}

export function getWeaponBp(
  { weapon, potential }: WeaponEquipState,
  grind: GrindLevel,
): BigNumber {
  const { varianceHigh, varianceLow, grindValues } = weapon
  const weaponAtt = grindValues[grind]

  const medianDamage = varianceLow.add(varianceHigh).div(2)
  const attBp = weaponAtt.mul(medianDamage).floor()
  const potentialBp = potential * 10

  return zero.add(attBp).add(potentialBp)
}

export function getClassBp({ defense, attack }: ClassLevel): BigNumber {
  return getDefenseBp(defense).add(attack)
}

export function getAugmentBp(augs: Augment[]): BigNumber {
  return augs.reduce((mem, aug) => mem.add(aug.stat.bp ?? zero), zero)
}

export const equipBpFamily = atomFamily((slot: AugmentableSlot) =>
  atom((get) => {
    const augAtom = augmentableFamily(slot)
    const augbp = getAugmentBp(get(augAtom))
    const grind = get(grindStateFamily(slot))
    if (slot === "weapon")
      return getWeaponBp(get(weaponStateAtom), grind).add(augbp).toNumber()
    const equipAtom = unitStateFamily(slot)
    const { defBp, statBp } = getUnitBp(get(equipAtom).unit, grind)
    return zero.add(defBp).add(statBp).add(augbp).toNumber()
  }),
)

export const classBpAtom = atom((get) => {
  const classInfo = get(classInfoAtom)
  return getClassBp(classInfo)
})

export const bpTotalAtom = atom((get) => {
  const augmentBp = getAugmentBp(get(allAugmentsAtom))
  const unitStates = unitSlots.map((s) => ({
    unit: get(unitStateFamily(s)).unit,
    grind: get(grindStateFamily(s)),
  }))

  const classBp = get(classBpAtom)

  const unitStatBp = unitStates
    .map(({ unit, grind }) => getUnitBp(unit, grind))
    .reduce(
      (memory, unitBp) => memory.add(unitBp.statBp).add(unitBp.defBp),
      zero,
    )

  // TODO: Special correction value by special ability?

  const weaponBp = getWeaponBp(
    get(weaponStateAtom),
    get(grindStateFamily("weapon")),
  )
  const skillpointBp = get(skillpointAtom) * 3 * 2 // points x3 for class and sub

  return zero
    .add(augmentBp)
    .add(weaponBp)
    .add(classBp)
    .add(skillpointBp)
    .add(unitStatBp)
    .floor()
    .toNumber()
})
