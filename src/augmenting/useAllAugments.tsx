import { useAugmentable } from "./augmentableState"
import { sample, sampleSize } from "lodash"
import { useCallback } from "react"
import { augmentByCategory } from "./data/augments"
import { Augment, AugmentCategory } from "./types"

const maxLengthify = (count: number) => (prior: Augment[]) =>
  prior.length > count ? prior.slice(0, count) : prior

export function useAllAugments() {
  const { setAugments: setunit1Augments } = useAugmentable("unit1")
  const { setAugments: setunit2Augments } = useAugmentable("unit2")
  const { setAugments: setunit3Augments } = useAugmentable("unit3")
  const { setAugments: setweaponAugments } = useAugmentable("weapon")
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

  const truncateAllAugments = useCallback(
    (count: number) => {
      const func = maxLengthify(count)
      setunit1Augments(func)
      setunit2Augments(func)
      setunit3Augments(func)
      setweaponAugments(func)
    },
    [setunit1Augments, setunit2Augments, setunit3Augments, setweaponAugments],
  )

  return {
    randomizeAllAugments,
    clearAllAugments,
    truncateAllAugments,
  }
}
