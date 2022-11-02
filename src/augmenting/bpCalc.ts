import { zero } from "MathConstants"
import { BigNumber, bignumber, sum } from "mathjs"
import { allClassData } from "./data/classes"
import { GrindLevel, Weapon, Augment, Unit, ClassAbbreviation } from "./types"

function getDefenseBp(def: BigNumber | number): BigNumber {
  let d
  if (typeof def == "number") d = bignumber(def)
  else d = def
  return d.div(2)
}

type UnitBpOptions = {
  unit: Unit
  grind: GrindLevel
}

export function getUnitBp({ unit, grind }: UnitBpOptions) {
  const {
    stat: { hp, pp },
  } = unit
  const def = unit.grindValues[grind]
  const hpBp = (hp ?? zero).div(10)
  const ppBp = pp ?? 0
  const defBp = getDefenseBp(def)

  return zero.add(defBp).add(hpBp).add(ppBp)
}

type ClassBpOptions = {
  name: ClassAbbreviation
  level: number
}

export function getClassBp({ name, level }: ClassBpOptions) {
  const { attack, defense } = allClassData[name][level]

  return getDefenseBp(defense).add(attack)
}

type WeaponBpOptions = {
  weapon: Weapon
  grind: GrindLevel
  potential: number
}

export function getWeaponBp({
  weapon,
  grind,
  potential,
}: WeaponBpOptions): BigNumber {
  const { varianceHigh, varianceLow, grindValues } = weapon
  const weaponAtt = grindValues[grind]

  const medianDamage = varianceLow.add(varianceHigh).div(2)
  const attBp = weaponAtt.mul(medianDamage).floor()
  const potentialBp = potential * 10

  return zero.add(attBp).add(potentialBp)
}

export function getAugmentBp(augments: Augment[]): BigNumber {
  return sum(augments.map((aug) => aug.stat.bp ?? zero))
}

export function getSkillpointBp(skillpoints: number): BigNumber {
  return zero.add(skillpoints).mul(6) // 3 per point, x2 for main and sub
}

export function getEquipBp(opts: WeaponBpOptions | UnitBpOptions) {}

type BpTotalOptions = {
  character: ClassBpOptions

  skillPoints: number

  weapon: WeaponBpOptions
  units: {
    unit: Unit
    grind: GrindLevel
  }[]

  augments: Augment[]
}

export function bpTotal(opts: BpTotalOptions): BigNumber {
  const items: BigNumber[] = []
  items.push(getClassBp(opts.character))
  items.push(getSkillpointBp(opts.skillPoints))
  items.push(getWeaponBp(opts.weapon))
  items.push(...opts.units.map(getUnitBp))
  items.push(getAugmentBp(opts.augments))

  return sum(items).floor()
}
