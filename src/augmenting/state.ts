import { atom, useAtom } from "jotai"
import {
  allAugments,
  Augment,
  AugmentStat,
  sumAugmentStats,
} from "./data/augment"
import { atomFamily, useUpdateAtom, atomWithHash } from "jotai/utils"
import { useCallback } from "react"

export const augmentSlots = ["weapon", "unit1", "unit2", "unit3"] as const

export type AugmentableSlot = typeof augmentSlots[number]
export const augmentSlotNiceName: Record<AugmentableSlot, string> = {
  weapon: "Weapon",
  unit1: "Unit 1",
  unit2: "Unit 2",
  unit3: "Unit 3",
}

const atob = (str: string) => Buffer.from(str, "base64").toString("binary")
const btoa = (str: string) => Buffer.from(str, "binary").toString("base64")

const fromId = (val: string): any => {
  return JSON.parse(atob(val))
}

const toId = (object: any) => {
  return btoa(JSON.stringify(object))
}

const revivify = (names: string[]): Augment[] => {
  return names
    .map((name) => allAugments.find((a) => a.name === name))
    .filter((x) => x) as Augment[]
}

export const maxAugmentAtom = atom(4)

const slotToHash: Record<AugmentableSlot, string> = {
  unit1: "u1Aug",
  unit2: "u2Aug",
  unit3: "u3Aug",
  weapon: "wAug",
}
const augmentableFamily = atomFamily((slot: AugmentableSlot) => {
  const id = slotToHash[slot]
  return atomWithHash<Augment[]>(id, [], {
    serialize(val) {
      return toId(val.map((a) => a.name))
    },
    deserialize(id) {
      return revivify(fromId(id)) as Augment[]
    },
  })
})

export const useAugmentable = (id: AugmentableSlot) => {
  const [max] = useAtom(maxAugmentAtom)

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
        const copy = [...prior]
        const newState = [
          ...copy.filter((a) => a.category !== augment.category),
          augment,
        ].sort((a, b) => a.name.localeCompare(b.name))
        if (newState.length > max) return prior
        return newState
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

export const statTotalAtom = atom<AugmentStat>((get) =>
  sumAugmentStats(augmentSlots.flatMap((n) => get(augmentableFamily(n)))),
)
