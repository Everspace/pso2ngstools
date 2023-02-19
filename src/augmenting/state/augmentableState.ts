import { sumAugmentStats, augmentifyUnit } from "augmenting/tools"
import { atom } from "jotai"
import { atomFamily } from "jotai/utils"
import { allAugments } from "../data/augments"
import {
  Augment,
  AugmentableSlot,
  augmentSlots,
  Unit,
  unitSlots,
  Weapon,
} from "../types"
import { augmentsPerSlotAtom, unitStateFamily } from "./equipmentState"
import { atomWithHash } from "jotai-location"

const revivify = (names: string[]): Augment[] => {
  return names
    .map((name) => allAugments.find((a) => a.name === name))
    .filter((x) => x) as Augment[]
}

const augmentSlotToHash: Record<AugmentableSlot, string> = {
  unit1: "u1Aug",
  unit2: "u2Aug",
  unit3: "u3Aug",
  weapon: "wAug",
}

export const augmentableFamily = atomFamily((slot: AugmentableSlot) => {
  const id = augmentSlotToHash[slot]
  return atomWithHash<Augment[]>(id, [], {
    setHash: "replaceState",
    serialize(val) {
      return JSON.stringify(val.map((a) => a.name))
    },
    deserialize(raw) {
      return revivify(JSON.parse(raw ?? "[]")) as Augment[]
    },
  })
})

export const addAugmentAtomFamily = atomFamily((slot: AugmentableSlot) => {
  const targetAtom = augmentableFamily(slot)
  return atom(null, (get, set, augment: Augment) => {
    const max = get(augmentsPerSlotAtom)
    const prior = get(targetAtom)
    let newState: Augment[] = [...prior]

    if (augment.category !== "unknown") {
      newState = newState.filter((a) => a.category !== augment.category)
    }
    // If this augment is part of a line of augments...
    if (augment.baseName) {
      newState = newState.filter((a) => a.baseName !== augment.baseName)
    }

    // If i'm in the last box, then I want to replace
    if (newState.length === max) {
      newState.pop()
    }
    newState.push(augment)

    newState = newState.sort((a, b) => a.name.localeCompare(b.name))
    set(targetAtom, newState)
    return
  })
})

export const removeAugmentAtomFamily = atomFamily((slot: AugmentableSlot) => {
  const targetAtom = augmentableFamily(slot)
  return atom(null, (_, set, augment: Augment) => {
    set(targetAtom, (prior) => prior.filter((c) => c.name !== augment.name))
    return
  })
})

export const clearAugmentFamily = atomFamily((slot: AugmentableSlot) => {
  const targetAtom = augmentableFamily(slot)
  return atom(null, (_, set) => {
    set(targetAtom, () => [])
    return
  })
})

export const allAugmentsAtom = atom((get) =>
  augmentSlots.flatMap((n) => get(augmentableFamily(n))),
)

export function sumEquipStats(equip: Weapon | Unit, augments: Augment[]) {
  const toSum = [...augments]
  if ("stat" in equip) {
    toSum.push(augmentifyUnit(equip))
  }
  if (toSum.length === 0) return null
  return sumAugmentStats(toSum)
}

export const allAugmentableSlotStatSum = atom(async (get) => {
  const augments = get(allAugmentsAtom)
  const unitAugs = unitSlots
    .map(unitStateFamily)
    .map((atom) => get(atom))
    .map((s) => augmentifyUnit(s))
  return sumAugmentStats([...augments, ...unitAugs])
})

// TODO: handle displaying that there is missing bp from the calculation
export const hasUnknownBpAug = atom(async (get) =>
  get(allAugmentsAtom).every((v) => v.stat.bp !== undefined),
)
