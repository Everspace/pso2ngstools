import { augmentByCategory } from "augmenting/data/augments"
import {
  augmentFufillsRequirement,
  augmentStatToDisplayInfo,
} from "augmenting/tools"
import {
  allAugmentCategories,
  allAugmentStats,
  Augment,
  AugmentCategory,
  AugmentStat,
} from "augmenting/types"
import { atom, WritableAtom } from "jotai"
import { atomFamily, atomWithReset, RESET } from "jotai/utils"
import { isNaN, bignumber } from "mathjs"

export const augmentCategoryStateAtom = atom<AugmentCategory>(
  allAugmentCategories[0],
)

export const searchStatFamilyAtom = atomFamily<
  keyof AugmentStat,
  WritableAtom<string, string | typeof RESET>
>((s) => atomWithReset(""))

export const searchStatAtom = atom<AugmentStat, AugmentStat | typeof RESET>(
  (get) => {
    const stat = Object.fromEntries(
      allAugmentStats
        .map((statName) => {
          return [statName, get(searchStatFamilyAtom(statName))] as const
        })
        .filter((entry) => {
          const [, value] = entry
          return value !== "" && !isNaN(Number(value))
        })
        .map((entry) => {
          const [key, value] = entry
          let newValue = bignumber(value.trim())
          if (augmentStatToDisplayInfo[key].percent) {
            // Convert into multiplier form
            newValue = newValue.dividedBy(100).add(1)
          }
          return [key, newValue] as const
        }),
    ) as AugmentStat
    return stat
  },
  (get, set, update) => {
    if (update === RESET) {
      allAugmentStats.forEach((s) => {
        const a = searchStatFamilyAtom(s)
        set(a, RESET)
      })
      return
    }
    Object.keys(update).forEach((s) => {
      const key = s as keyof AugmentStat
      const a = searchStatFamilyAtom(key)
      set(a, update[key]!.toString())
    })
  },
)

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
    filteredAugments = filteredAugments.filter((a) =>
      augmentFufillsRequirement(a, searchStat),
    )
  }

  return filteredAugments
})
