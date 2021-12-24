import { atom } from "jotai"
import { zero } from "MathConstants"
import { allAugmentsAtom, unitSlots } from "./augmentableState"
import {
  UnitEquipState,
  unitStateFamily,
  WeaponEquipState,
  weaponState,
} from "./equipmentState"

function getUnitBp({ unit, fullyGround }: UnitEquipState) {
  const {
    defenseBase,
    defenseMax,
    stat: { hp, pp },
  } = unit

  return zero
    .add((fullyGround ? defenseMax : defenseBase).div(2))
    .add((hp ?? zero).div(10))
    .add(pp ?? 0)
}

function getWeaponBp({ weapon, potential, fullyGround }: WeaponEquipState) {
  const { attackBase, attackMax, varianceHigh, varianceLow } = weapon
  const weaponAtt = fullyGround ? attackMax : attackBase

  return zero
    .add(potential * 10)
    .add(weaponAtt.mul(varianceLow.add(varianceHigh).div(2)))
}

export const bpTotalAtom = atom((get) => {
  const augmentBp = get(allAugmentsAtom)
    .map((aug) => aug.bp ?? 0)
    .reduce((mem, n) => mem + n, 0)

  const unitBp = unitSlots
    .map((s) => get(unitStateFamily(s)))
    .reduce((memory, state) => {
      return memory.add(getUnitBp(state))
    }, zero)

  // TODO: Special correction value by special ability?

  const weaponBp = getWeaponBp(get(weaponState))

  // const class = get(classAtom)
  // const level = get(levelAtom)
  // const classLevel allClassLevels[class][level]
  // const classBp = classLevel.attack + math.floor(classlevel.defense / 2)
  return zero.add(augmentBp).add(unitBp).add(weaponBp)
})
