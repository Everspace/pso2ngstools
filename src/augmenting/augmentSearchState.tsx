import {
  allAugmentCategories,
  allAugmentStats,
  Augment,
  augmentByCategory,
  AugmentCategory,
  augmentFufillsRequirement,
  AugmentStat,
  augmentStatToDisplayInfo,
} from "./data/augment"
import { atom, WritableAtom } from "jotai"
import { atomFamily, atomWithReset, RESET } from "jotai/utils"
import * as math from "mathjs"

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
          return value !== "" && !math.isNaN(Number(value))
        })
        .map((entry) => {
          const [key, value] = entry
          let newValue = math.bignumber(value)
          if (augmentStatToDisplayInfo[key].percent) {
            newValue = newValue.dividedBy(100)
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
