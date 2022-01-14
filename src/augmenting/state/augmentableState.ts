import { sumAugmentStats, augmentifyUnit } from "augmenting/tools"
import { Atom, atom } from "jotai"
import { atomFamily, atomWithHash } from "jotai/utils"
import { toId, fromId } from "utils"
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
      return toId(val.map((a) => a.name))
    },
    deserialize(id) {
      return revivify(fromId(id)) as Augment[]
    },
  })
})

export const addAugmentAtomFamily = atomFamily((slot: AugmentableSlot) => {
  const targetAtom = augmentableFamily(slot)
  return atom<undefined, Augment>(undefined, (get, set, augment) => {
    const max = get(augmentsPerSlotAtom)
    const prior = get(targetAtom)
    let newState: Augment[] = [...prior]

    if (augment.category !== "basic") {
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
  return atom<undefined, Augment>(undefined, (_, set, augment) => {
    set(targetAtom, (prior) => prior.filter((c) => c.name !== augment.name))
  })
})

export const clearAugmentFamily = atomFamily((slot: AugmentableSlot) => {
  const targetAtom = augmentableFamily(slot)
  return atom<undefined, any>(undefined, (_, set) => {
    set(targetAtom, () => [])
  })
})

export const allAugmentsAtom = atom<Augment[]>((get) =>
  augmentSlots.flatMap((n) => get(augmentableFamily(n))),
)

export const augmentableSlotStatSum = atomFamily<
  AugmentableSlot,
  Atom<AugmentStat | null>
>((slot) => {
  const augmentsAtom = augmentableFamily(slot)
  if (slot === "weapon") {
    return atom((get) => {
      const augments = get(augmentsAtom)
      if (augments.length === 0) return null
      return sumAugmentStats(augments)
    })
  }
  const unitAtom = unitStateFamily(slot)
  return atom((get) => {
    const augments = get(augmentsAtom)
    const { unit } = get(unitAtom)
    if (augments.length === 0 && unit.name === "None") return null
    return sumAugmentStats([...augments, augmentifyUnit(unit)])
  })
})

export const allAugmentableSlotStatSum = atom((get) => {
  const augments = get(allAugmentsAtom)
  const unitAugs = unitSlots
    .map(unitStateFamily)
    .map((atom) => get(atom))
    .map((s) => augmentifyUnit(s.unit))
  return sumAugmentStats([...augments, ...unitAugs])
})

// TODO: handle displaying that there is missing bp from the calculation
export const hasUnknownBpAug = atom<boolean>((get) =>
  get(allAugmentsAtom).every((v) => v.stat.bp !== undefined),
)
