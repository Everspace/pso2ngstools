import { atom, useSetAtom } from "jotai"
import { RESET } from "jotai/utils"
import { sample, sampleSize } from "lodash"
import { augmentByCategory } from "./data/augments"
import { MAX_AUGMENTS_PER_SLOT } from "./data/consts"
import { augmentableFamily } from "./state/augmentableState"
import { Augment, augmentSlots } from "./types"

const setAllUnitsAtom = atom(null, (_get, set, update: Augment[]) => {
  augmentSlots.map((name) => set(augmentableFamily(name), update))
})

const clearAllAugmentsAtom = atom(null, (_get, set) => {
  augmentSlots.map((name) => set(augmentableFamily(name), RESET))
})

const randomizeAllAugmentsAtom = atom(null, (_get, set) => {
  const categories = sampleSize(
    Object.keys(augmentByCategory),
    MAX_AUGMENTS_PER_SLOT,
  ) as string[]
  const augments = categories.map(
    (category) => sample(augmentByCategory[category]) as Augment,
  )
  set(setAllUnitsAtom, augments)
})

export function useAllAugments() {
  const randomizeAllAugments = useSetAtom(randomizeAllAugmentsAtom)
  const clearAllAugments = useSetAtom(clearAllAugmentsAtom)

  return {
    randomizeAllAugments,
    clearAllAugments,
  }
}
