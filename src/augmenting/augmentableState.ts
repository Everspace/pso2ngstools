import { atom, useAtom } from "jotai"
import {
  atomFamily,
  useUpdateAtom,
  atomWithHash,
  atomWithStorage,
} from "jotai/utils"
import { useCallback } from "react"
import { toId, fromId } from "utils"
import { allAugments } from "./data/augments"
import { Augment } from "./types"

export const augmentSlots = ["weapon", "unit1", "unit2", "unit3"] as const
export type AugmentableSlot = typeof augmentSlots[number]

export type UnitSlot = Exclude<AugmentableSlot, "weapon">
export const unitSlots: UnitSlot[] = ["unit1", "unit2", "unit3"]

export const augmentSlotNiceName: Record<AugmentableSlot, string> = {
  weapon: "Weapon",
  unit1: "Unit 1",
  unit2: "Unit 2",
  unit3: "Unit 3",
}

const revivify = (names: string[]): Augment[] => {
  return names
    .map((name) => allAugments.find((a) => a.name === name))
    .filter((x) => x) as Augment[]
}

export const MAX_AUGMENTS_PER_SLOT = 8
export const augmentsPerSlotAtom = atomWithStorage("augmentPerSlot", 4)

const augmentSlotToHash: Record<AugmentableSlot, string> = {
  unit1: "u1Aug",
  unit2: "u2Aug",
  unit3: "u3Aug",
  weapon: "wAug",
}

const augmentableFamily = atomFamily((slot: AugmentableSlot) => {
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

export const useAugmentable = (id: AugmentableSlot) => {
  const [max] = useAtom(augmentsPerSlotAtom)

  const augmentableAtom = augmentableFamily(id)
  const [augments, setAugments] = useAtom(augmentableAtom)
  const updateAugments = useUpdateAtom(augmentableAtom)

  const removeAugment = useCallback(
    (augment: Augment) =>
      updateAugments((prior) => prior.filter((c) => c.name !== augment.name)),
    [updateAugments],
  )

  const addAugment = useCallback(
    (augment: Augment) => {
      updateAugments((prior) => {
        let newState: Augment[] = [...prior]

        if (augment.category !== "basic") {
          newState = newState.filter((a) => a.category !== augment.category)
        }
        newState.push(augment)

        if (newState.length > max) return prior
        return newState.sort((a, b) => a.name.localeCompare(b.name))
      })
    },
    [updateAugments, max],
  )

  const clearAugments = useCallback(
    () => updateAugments(() => []),
    [updateAugments],
  )

  return {
    max,
    augments,
    setAugments,
    addAugment,
    removeAugment,
    clearAugments,
  }
}

export const allAugmentsAtom = atom<Augment[]>((get) =>
  augmentSlots.flatMap((n) => get(augmentableFamily(n))),
)

// TODO: handle displaying that there is missing bp from the calculation
export const hasUnknownBpAug = atom<boolean>((get) =>
  get(allAugmentsAtom).every((v) => v.stat.bp !== undefined),
)
