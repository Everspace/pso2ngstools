import { atom, useAtom } from "jotai"
import { Augment, AugmentStat, sumAugmentStats } from "./data/augment"
import { atomFamily, useUpdateAtom } from "jotai/utils"
import { useCallback } from "react"

export const maxAugmentAtom = atom(4)

export const augmentSlots = ["weapon", "unit1", "unit2", "unit3"] as const

export type AugmentableSlot = typeof augmentSlots[number]
export const augmentSlotNiceName: Record<AugmentableSlot, string> = {
  weapon: "Weapon",
  unit1: "Unit 1",
  unit2: "Unit 2",
  unit3: "Unit 3",
}

export const augmentableFamily = atomFamily((id: AugmentableSlot) =>
  atom([] as Augment[]),
)

export const useAugmentable = (id: AugmentableSlot) => {
  const [max] = useAtom(maxAugmentAtom)
  const [augments, setAugments] = useAtom(augmentableFamily(id))
  const updateAugments = useUpdateAtom(augmentableFamily(id))
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
