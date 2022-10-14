import { sumAugmentStats, augmentifyUnit } from "augmenting/tools"
import { Atom, atom } from "jotai"
import { atomFamily, atomWithHash } from "jotai/utils"
import { allAugments } from "../data/augments"
import {
  Augment,
  AugmentableSlot,
  augmentSlots,
  AugmentStat,
  unitSlots,
} from "../types"
import { augmentsPerSlotAtom, unitStateFamily } from "./equipmentState"

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
    replaceState: true,
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
  return atom<undefined, Augment>(undefined, async (get, set, augment) => {
    const max = get(augmentsPerSlotAtom)
    const prior = get(targetAtom)
    let newState: Augment[] = [...prior]

    if (augment.category !== "unknown") {
      newState = newState.filter((a) => a.category !== augment.category)
    }
    newState.push(augment)

    if (newState.length > max) {
      set(targetAtom, prior)
      return prior
    }

    newState = newState.sort((a, b) => a.name.localeCompare(b.name))
    set(targetAtom, newState)
    return newState
  })
})

export const removeAugmentAtomFamily = atomFamily((slot: AugmentableSlot) => {
  const targetAtom = augmentableFamily(slot)
  return atom<undefined, Augment>(undefined, async (_, set, augment) => {
    set(targetAtom, (prior) => prior.filter((c) => c.name !== augment.name))
  })
})

export const clearAugmentFamily = atomFamily((slot: AugmentableSlot) => {
  const targetAtom = augmentableFamily(slot)
  return atom<undefined, any>(undefined, async (_, set) => {
    set(targetAtom, () => [])
  })
})

export const allAugmentsAtom = atom(async (get) =>
  augmentSlots.flatMap((n) => get(augmentableFamily(n))),
)

export const augmentableSlotStatSum = atomFamily<
  AugmentableSlot,
  Atom<Promise<AugmentStat | null>>
>((slot) => {
  const augmentsAtom = augmentableFamily(slot)
  if (slot === "weapon") {
    return atom(async (get) => {
      const augments = get(augmentsAtom)
      if (augments.length === 0) return null
      return sumAugmentStats(augments)
    })
  }
  const unitAtom = unitStateFamily(slot)
  return atom(async (get) => {
    const augments = get(augmentsAtom)
    const unit = get(unitAtom)
    if (augments.length === 0 && unit.name === "None") return null
    return sumAugmentStats([...augments, augmentifyUnit(unit)])
  })
})

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
