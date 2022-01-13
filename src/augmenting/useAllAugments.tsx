import { useUpdateAtom } from "jotai/utils"
import { sample, sampleSize } from "lodash"
import { useCallback } from "react"
import { augmentByCategory } from "./data/augments"
import { augmentableFamily } from "./state/augmentableState"
import { AugmentCategory } from "./types"

export function useAllAugments() {
  const setunit1Augments = useUpdateAtom(augmentableFamily("unit1"))
  const setunit2Augments = useUpdateAtom(augmentableFamily("unit2"))
  const setunit3Augments = useUpdateAtom(augmentableFamily("unit3"))
  const setweaponAugments = useUpdateAtom(augmentableFamily("weapon"))

  const randomizeAllAugments = useCallback(() => {
    const categories = sampleSize(
      Object.keys(augmentByCategory),
      4,
    ) as AugmentCategory[]
    const augments = categories.map(
      (category) => sample(augmentByCategory[category]!)!,
    )

    setunit1Augments(augments)
    setunit2Augments(augments)
    setunit3Augments(augments)
    setweaponAugments(augments)
  }, [setunit1Augments, setunit2Augments, setunit3Augments, setweaponAugments])

  const clearAllAugments = useCallback(() => {
    setunit1Augments([])
    setunit2Augments([])
    setunit3Augments([])
    setweaponAugments([])
  }, [setunit1Augments, setunit2Augments, setunit3Augments, setweaponAugments])

  return {
    randomizeAllAugments,
    clearAllAugments,
  }
}
