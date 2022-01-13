import { allClassData } from "augmenting/data/class"
import {
  Augment,
  AugmentableSlot,
  ClassLevel,
  unitSlots,
} from "augmenting/types"
import { atom } from "jotai"
import { atomFamily } from "jotai/utils"
import { zero } from "MathConstants"
import { BigNumber, bignumber } from "mathjs"
import { allAugmentsAtom, augmentableFamily } from "./augmentableState"
import { classNameAtom, levelAtom, skillpointAtom } from "./characterState"
import {
  UnitEquipState,
  unitStateFamily,
  WeaponEquipState,
  weaponStateAtom,
} from "./equipmentState"

export function getUnitBp({ unit, fullyGround }: UnitEquipState) {
  const {
    defenseBase,
    defenseMax,
    stat: { hp, pp },
  } = unit

  return zero
    .add((fullyGround ? defenseMax : defenseBase).div(2).floor())
    .add((hp ?? zero).div(10).floor())
    .add(pp ?? 0)
}

export function getWeaponBp({
  weapon,
  potential,
  fullyGround,
}: WeaponEquipState): BigNumber {
  const { attackBase, attackMax, varianceHigh, varianceLow } = weapon
  const weaponAtt = fullyGround ? attackMax : attackBase

  return zero
    .add(potential * 10)
    .add(weaponAtt.mul(varianceLow.add(varianceHigh).div(2)).floor())
}

export function getClassBp({ defense, attack }: ClassLevel): BigNumber {
  return bignumber(defense).div(2).floor().add(attack)
}

export function getAugmentBp(augs: Augment[]): BigNumber {
  return augs.reduce((mem, aug) => mem.add(aug.stat.bp ?? zero), zero)
}

export const equipBpFamily = atomFamily((slot: AugmentableSlot) =>
  atom((get) => {
    const augAtom = augmentableFamily(slot)
    const augbp = getAugmentBp(get(augAtom))
    if (slot === "weapon")
      return getWeaponBp(get(weaponStateAtom)).add(augbp).toNumber()
    const equipAtom = unitStateFamily(slot)
    return getUnitBp(get(equipAtom)).add(augbp).toNumber()
  }),
)

export const classBpAtom = atom((get) => {
  const className = get(classNameAtom)
  const classLevel = get(levelAtom)
  const classInfo = allClassData[className][classLevel]
  return getClassBp(classInfo)
})

export const bpTotalAtom = atom((get) => {
  const augmentBp = getAugmentBp(get(allAugmentsAtom))

  const unitBp = unitSlots
    .map((s) => get(unitStateFamily(s)))
    .reduce((memory, state) => {
      return memory.add(getUnitBp(state))
    }, zero)

  // TODO: Special correction value by special ability?

  const weaponBp = getWeaponBp(get(weaponStateAtom))
  const classBp = get(classBpAtom)

  const skillpointBp = get(skillpointAtom) * 3 * 2 // points x3 for class and sub

  return zero
    .add(augmentBp)
    .add(unitBp)
    .add(weaponBp)
    .add(classBp)
    .add(skillpointBp)
    .toNumber()
})
