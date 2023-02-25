import { atomWithQuery } from "atomTools"
import { atom } from "jotai/vanilla"
import { atomFamily } from "jotai/vanilla/utils"
import { allUnits } from "../data/armours"
import {
  DEFAULT_AUGMENTS_PER_SLOT,
  DEFAULT_UNIT,
  DEFAULT_WEAPON,
  MAX_GRIND,
} from "../data/consts"
import { allWeapons } from "../data/weapons"
import {
  AugmentableSlot,
  augmentSlots,
  Unit,
  UnitSlot,
  unitSlots,
  Weapon,
} from "../types"
import { augmentableFamily } from "./augmentableState"

const slotToHash: Record<AugmentableSlot, string> = {
  unit1: "u1",
  unit2: "u2",
  unit3: "u3",
  weapon: "w",
}

const grindStateSlotToHash: Record<AugmentableSlot, string> = {
  unit1: "u1g",
  unit2: "u2g",
  unit3: "u3g",
  weapon: "wg",
}

const augmentsPerSlotRawAtom = atomWithQuery("slots", DEFAULT_AUGMENTS_PER_SLOT)

export const augmentsPerSlotAtom = atom(
  (get) => get(augmentsPerSlotRawAtom),
  async (get, set, update: number) => {
    augmentSlots.map(augmentableFamily).forEach((a) => {
      const val = get(a)
      set(a, val.slice(0, update))
    })
    set(augmentsPerSlotRawAtom, update)
  },
)

export const grindStateFamily = atomFamily((slot: AugmentableSlot) =>
  atomWithQuery(grindStateSlotToHash[slot], MAX_GRIND),
)

export const unitStateFamily = atomFamily((slot: UnitSlot) => {
  const id = slotToHash[slot]
  return atomWithQuery<Unit>(id, DEFAULT_UNIT, {
    serialize(unit) {
      return unit.name
    },
    deserialize(name) {
      return allUnits[name ?? DEFAULT_UNIT.name]
    },
  })
})

export const weaponStateAtom = atomWithQuery<Weapon>(
  slotToHash["weapon"],
  DEFAULT_WEAPON,
  {
    serialize(weapon) {
      return weapon.name
    },
    deserialize(name) {
      return allWeapons[name ?? DEFAULT_WEAPON.name]
    },
  },
)

export const weaponPotentialAtom = atomWithQuery("wp", 3)

export const equipStateFamily = atomFamily((slot: AugmentableSlot) => {
  if (slot === "weapon") return weaponStateAtom
  return unitStateFamily(slot)
})

export type CopyAugmentAtomOptions = {
  from: AugmentableSlot
  to: AugmentableSlot | "units" | "all"
}

export const mirrorUnitAtom = atom(
  undefined,
  async (get, set, slot: UnitSlot) => {
    const fromAugmentable = get(augmentableFamily(slot))
    const fromUnit = get(unitStateFamily(slot))
    const fromGrind = get(grindStateFamily(slot))

    unitSlots
      .filter((other) => other !== slot)
      .forEach((other) => {
        set(augmentableFamily(other), fromAugmentable)
        set(unitStateFamily(other), fromUnit)
        set(grindStateFamily(other), fromGrind)
      })
  },
)

export const copyAugmentAtom = atom(
  null,
  (get, set, { from, to }: CopyAugmentAtomOptions) => {
    const fromAugments = get(augmentableFamily(from))
    const targetSlots: AugmentableSlot[] = []
    switch (to) {
      case "units":
        targetSlots.push(...unitSlots)
        break
      case "all":
        targetSlots.push(...augmentSlots)
        break
      default:
        targetSlots.push(to)
        break
    }
    targetSlots
      .filter((slot) => slot !== from)
      .map(augmentableFamily)
      .forEach((a) => set(a, fromAugments))
  },
)
