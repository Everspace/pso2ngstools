import { bpTotal } from "augmenting/bpCalc"
import { augmentValueToString, rangeToLine } from "augmenting/info"
import {
  allAugmentableSlotStatSum,
  allAugmentsAtom,
} from "augmenting/state/augmentableState"
import {
  classNameAtom,
  levelAtom,
  skillpointAtom,
} from "augmenting/state/characterState"
import {
  grindStateFamily,
  unitStateFamily,
  weaponPotentialAtom,
  weaponStateAtom,
} from "augmenting/state/equipmentState"
import { rangeFromWeaponAugments, simplifyAugmentStat } from "augmenting/tools"
import { UnitSlot, unitSlots } from "augmenting/types"
import type { Atom, ExtractAtomValue } from "jotai/vanilla"
import { zero } from "MathConstants"
import { equipmentCalcStore } from "../state/store"

function get<T extends Atom<unknown>>(atom: T) {
  return equipmentCalcStore.get(atom) as ExtractAtomValue<T>
}

export const getTitle = () => {
  const cl = get(classNameAtom)
  const bp = bpTotal({
    weapon: {
      grind: get(grindStateFamily("weapon")),
      potential: get(weaponPotentialAtom),
      weapon: get(weaponStateAtom),
    },
    augments: get(allAugmentsAtom),
    character: {
      level: get(levelAtom),
      name: cl,
    },
    skillPoints: get(skillpointAtom),
    units: unitSlots.map((s) => ({
      unit: get(unitStateFamily(s)),
      grind: get(grindStateFamily(s)),
    })),
  })
  return `Augment Calculator: ${cl} - ${bp}bp`
}

const getWeaponInfo = () => {
  const weapon = get(weaponStateAtom)
  const weaponPotential = get(weaponPotentialAtom)
  const weaponGrind = get(grindStateFamily("weapon"))
  return {
    name: `${weapon.name}+${weaponGrind}`,
    stats: weapon,
    range: { max: weapon.varianceHigh, min: weapon.varianceLow },
    potential: weaponPotential,
  }
}

const getUnitInfo = (slot: UnitSlot) => {
  const unit = get(unitStateFamily(slot))
  const grind = get(grindStateFamily(slot))
  return `${unit.name}+${grind}`
}

export const getDescription = () => {
  const rawStats = get(allAugmentableSlotStatSum)
  const stats = simplifyAugmentStat(rawStats)
  const lines: string[] = []

  const weapon = getWeaponInfo()
  const units = (["unit1", "unit2", "unit3"] as UnitSlot[]).map(getUnitInfo)
  lines.push(weapon.name)
  lines.push(units.join("/"))
  lines.push("")

  const hpppline: string[] = []
  if (stats?.hp) hpppline.push(`HP: ${stats.hp}`)
  if (stats.pp) hpppline.push(`PP: ${stats.pp}`)
  if (hpppline.length > 0) lines.push(hpppline.join(", "))

  const statLine: string[] = []
  statLine.push(
    `MATK ${augmentValueToString("meleePotency", stats.meleePotency ?? zero)}`,
  )
  statLine.push(
    `RATK ${augmentValueToString(
      "rangedPotency",
      stats.rangedPotency ?? zero,
    )}`,
  )
  statLine.push(
    `TATK ${augmentValueToString("techPotency", stats.techPotency ?? zero)}`,
  )
  lines.push(statLine.join("/"))

  if (stats.floorPotency) {
    // TODO: or ceilPotency
    const range = rangeFromWeaponAugments(weapon.stats, stats)
    lines.push(`Weapon Range: ${rangeToLine(range)}`)
  }

  if (stats.damageResist) {
    lines.push(
      `Damage Resist: ${augmentValueToString(
        "damageResist",
        stats.damageResist,
      )}`,
    )
  }
  if (stats.statusResist) {
    lines.push(
      `Status Resist: ${augmentValueToString(
        "statusResist",
        stats.statusResist,
      )}`,
    )
  }

  return lines.join("\n")
}
