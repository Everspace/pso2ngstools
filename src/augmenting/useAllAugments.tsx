import useTransitionedAtom from "hooks/useTransitionedAtom"
import { atom } from "jotai"
import { RESET } from "jotai/utils"
import { sample, sampleSize } from "lodash"
import { augmentByCategory } from "./data/augments"
import { MAX_AUGMENTS_PER_SLOT } from "./data/consts"
import { augmentableFamily } from "./state/augmentableState"
import { Augment, augmentSlots } from "./types"

const setAllUnitsAtom = atom<any, Augment[], any>(
  undefined,
  (get, set, update) => {
    augmentSlots.map((name) => set(augmentableFamily(name), update))
  },
)

const clearAllAugmentsAtom = atom<void, any, any>(
  undefined,
  (get, set, update) => {
    augmentSlots.map((name) => set(augmentableFamily(name), RESET))
  },
)

const randomizeAllAugmentsAtom = atom<any, any, void>(undefined, (get, set) => {
  const categories = sampleSize(
    Object.keys(augmentByCategory),
    MAX_AUGMENTS_PER_SLOT,
  ) as string[]
  const augments = categories.map(
    (category) => sample(augmentByCategory[category]!)!,
  )
  set(setAllUnitsAtom, augments)
})

export function useAllAugments() {
  const [, randomizeAllAugments] = useTransitionedAtom(randomizeAllAugmentsAtom)

  const [, clearAllAugments] = useTransitionedAtom(clearAllAugmentsAtom)

  return {
    randomizeAllAugments,
    clearAllAugments,
  }
}
