import { ClassLevel } from "augmenting/types"
import { atom } from "jotai"
import { zero } from "MathConstants"
import { BigNumber, bignumber } from "mathjs"
import { allAugmentsAtom, unitSlots } from "./augmentableState"
import { classInfoAtom, skillpointAtom } from "./characterState"
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
}: WeaponEquipState) {
  const { attackBase, attackMax, varianceHigh, varianceLow } = weapon
  const weaponAtt = fullyGround ? attackMax : attackBase

  return zero
    .add(potential * 10)
    .add(weaponAtt.mul(varianceLow.add(varianceHigh).div(2)).floor())
}

export function getClassBp({ defense, attack }: ClassLevel): BigNumber {
  return bignumber(defense).div(2).floor().add(attack)
}

export const bpTotalAtom = atom((get) => {
  const augmentBp = get(allAugmentsAtom).reduce(
    (mem, aug) => mem.add(aug.stat.bp ?? zero),
    zero,
  )

  const unitBp = unitSlots
    .map((s) => get(unitStateFamily(s)))
    .reduce((memory, state) => {
      return memory.add(getUnitBp(state))
    }, zero)

  // TODO: Special correction value by special ability?

  const weaponBp = getWeaponBp(get(weaponStateAtom))

  const classInfo = get(classInfoAtom)
  const classBp = getClassBp(classInfo)

  const skillpointBp = get(skillpointAtom) * 3 * 2 // points x3 for class and sub

  return zero
    .add(augmentBp)
    .add(unitBp)
    .add(weaponBp)
    .add(classBp)
    .add(skillpointBp)
    .toNumber()
})
