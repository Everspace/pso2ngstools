import {
  allAugmentCategories,
  Augment,
  augmentByCategory,
  AugmentCategory,
  augmentFufillsRequirement,
  AugmentStat,
} from "./data/augment"
import { atom } from "jotai"
import { atomWithReset } from "jotai/utils"

export const augmentCategoryStateAtom = atom<AugmentCategory>(
  allAugmentCategories[0],
)

export const searchStatAtom = atomWithReset<AugmentStat | null>(null)
export const searchNameAtom = atomWithReset("")
export const availableAugments = atom<Augment[]>((get) => {
  const category = get(augmentCategoryStateAtom)
  const searchStat = get(searchStatAtom)
  const searchName = get(searchNameAtom).toLocaleLowerCase()
  let filteredAugments = [...augmentByCategory[category]]
  if (searchName !== "") {
    filteredAugments = filteredAugments.filter((a) =>
      a.name.toLocaleLowerCase().includes(searchName),
    )
  }
  if (searchStat) {
    filteredAugments.filter((a) => augmentFufillsRequirement(a, searchStat))
  }

  return filteredAugments
})
