import { atom } from "jotai"
import { atomFamily } from "jotai/utils"
import { allUnits } from "../data/armours"
import { allWeapons } from "../data/weapons"
import {
  AugmentableSlot,
  augmentSlots,
  Unit,
  UnitSlot,
  Weapon,
  unitSlots,
} from "../types"
import { augmentableFamily } from "./augmentableState"
import {
  DEFAULT_AUGMENTS_PER_SLOT,
  DEFAULT_UNIT,
  DEFAULT_WEAPON,
  MAX_GRIND,
} from "../data/consts"
import { atomWithHash } from "jotai-location"
import { subscribeToRouter } from "atomTools"

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

const augmentsPerSlotRawAtom = atomWithHash(
  "slots",
  DEFAULT_AUGMENTS_PER_SLOT,
  {
    subscribe: subscribeToRouter,
    setHash: "replaceState",
  },
)

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
  atomWithHash(grindStateSlotToHash[slot], MAX_GRIND, {
    subscribe: subscribeToRouter,
    setHash: "replaceState",
  }),
)

export const unitStateFamily = atomFamily((slot: UnitSlot) => {
  const id = slotToHash[slot]
  return atomWithHash<Unit>(id, DEFAULT_UNIT, {
    subscribe: subscribeToRouter,
    setHash: "replaceState",
    serialize(unit) {
      return unit.name
    },
    deserialize(name) {
      return allUnits[name ?? DEFAULT_UNIT.name]
    },
  })
})

export const weaponStateAtom = atomWithHash<Weapon>(
  slotToHash["weapon"],
  DEFAULT_WEAPON,
  {
    subscribe: subscribeToRouter,
    setHash: "replaceState",
    serialize(weapon) {
      return weapon.name
    },
    deserialize(name) {
      return allWeapons[name ?? DEFAULT_WEAPON.name]
    },
  },
)

export const weaponPotentialAtom = atomWithHash("wp", 3, {
  subscribe: subscribeToRouter,
  setHash: "replaceState",
})

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
