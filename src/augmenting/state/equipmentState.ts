import { atom, PrimitiveAtom } from "jotai"
import { atomFamily, atomWithHash } from "jotai/utils"
import { allUnits } from "../data/armours"
import { allWeapons } from "../data/weapons"
import {
  AugmentableSlot,
  augmentSlots,
  Unit,
  UnitSlot,
  Weapon,
  MAX_GRIND,
  unitSlots,
} from "../types"
import { augmentableFamily } from "./augmentableState"
import { DEFAULT_AUGMENT_SLOTS, DEFAULT_UNIT, DEFAULT_WEAPON } from "./consts"

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

const augmentsPerSlotRawAtom = atomWithHash("slots", DEFAULT_AUGMENT_SLOTS, {
  replaceState: true,
})

export const augmentsPerSlotAtom = atom<number, number>(
  (get) => get(augmentsPerSlotRawAtom),
  async (get, set, update) => {
    augmentSlots.map(augmentableFamily).forEach((a) => {
      const val = get(a)
      set(a, val.slice(0, update))
    })
    set(augmentsPerSlotRawAtom, update)
  },
)

export const grindStateFamily = atomFamily((slot: AugmentableSlot) =>
  atomWithHash(grindStateSlotToHash[slot], MAX_GRIND, {
    replaceState: true,
  }),
)

export const unitStateFamily = atomFamily((slot: UnitSlot) => {
  const id = slotToHash[slot]
  return atomWithHash<Unit>(id, DEFAULT_UNIT, {
    replaceState: true,
    serialize(unit) {
      return unit.name
    },
    deserialize(name) {
      return allUnits[name ?? "None"]
    },
  })
})

export const weaponStateAtom = atomWithHash<Weapon>(
  slotToHash["weapon"],
  DEFAULT_WEAPON,
  {
    replaceState: true,
    serialize(weapon) {
      return weapon.name
    },
    deserialize(name) {
      return allWeapons[name ?? "None"]
    },
  },
)

export const weaponPotentialAtom = atomWithHash("wp", 3, { replaceState: true })

export const equipStateFamily = atomFamily<
  AugmentableSlot,
  PrimitiveAtom<Weapon> | PrimitiveAtom<Unit>
>((slot: AugmentableSlot) => {
  if (slot === "weapon") return weaponStateAtom
  return unitStateFamily(slot)
})

export type CopyAugmentAtomOptions = {
  from: AugmentableSlot
  to: AugmentableSlot | "units" | "all"
}

export const copyAugmentAtom = atom<void, CopyAugmentAtomOptions>(
  undefined,
  async (get, set, { from, to }) => {
    const fromAugments = get(augmentableFamily(from))
    let targetSlots: AugmentableSlot[] = []
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
