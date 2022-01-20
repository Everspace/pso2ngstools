import { allAugments, augmentByCategory } from "augmenting/data/augments"
import { augmentStatToDisplayInfo } from "augmenting/info"
import { augmentFufillsRequirement } from "augmenting/tools"
import {
  allAugmentCategories,
  allAugmentStats,
  Augment,
  AugmentCategory,
  AugmentStat,
} from "augmenting/types"
import { atom, WritableAtom } from "jotai"
import { atomFamily, atomWithReset, RESET } from "jotai/utils"
import { groupBy } from "lodash"
import { isNaN, bignumber } from "mathjs"

export type SearchAugmentCategory = AugmentCategory | "all"
export const augmentSearchCategories = [
  "all",
  ...[...allAugmentCategories].sort(),
] as SearchAugmentCategory[]

export const augmentCategoryStateAtom = atom<SearchAugmentCategory>("basic")

export const searchStatFamilyAtom = atomFamily<
  keyof AugmentStat,
  WritableAtom<string, string | typeof RESET>
>(
  () => atomWithReset(""),
  (a, b) => a === b,
)

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
      return Promise.all(
        allAugmentStats.map(searchStatFamilyAtom).map(async (atom) => {
          set(atom, RESET)
        }),
      )
    }
    Object.keys(update).forEach((s) => {
      const key = s as keyof AugmentStat
      const a = searchStatFamilyAtom(key)
      set(a, update[key]!.toString())
    })
  },
)

export const searchNameAtom = atomWithReset("")
const availableAugmentsAtom = atom<Augment[]>((get) => {
  const category = get(augmentCategoryStateAtom)

  const searchStat = get(searchStatAtom)
  const searchName = get(searchNameAtom).toLocaleLowerCase()
  let filteredAugments: Augment[]

  if (category === "all") {
    filteredAugments = [...allAugments]
  } else {
    filteredAugments = [...augmentByCategory[category]]
  }

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

export const augmentGroupsAtom = atom((get) => {
  const allAugments = get(availableAugmentsAtom)
  const groups = groupBy(allAugments, (a) => (a.baseName ? a.baseName : a.name))

  return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]))
})
