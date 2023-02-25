import { augmentByCategory } from "augmenting/data/augments"
import { augmentStatToDisplayInfo } from "augmenting/info"
import { augmentFufillsRequirement } from "augmenting/tools"
import {
  allAugmentCategories,
  allAugmentStats,
  Augment,
  AugmentStat,
} from "augmenting/types"
import { atom } from "jotai"
import { atomFamily, atomWithReset, RESET } from "jotai/utils"
import { groupBy } from "lodash"
import { bignumber, isNaN } from "mathjs"

export type SearchAugmentCategory = string
export const augmentSearchCategories = [
  ...allAugmentCategories,
] as SearchAugmentCategory[]

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const augmentCategoryStateFamilyAtom = atomFamily((category: string) =>
  atom(false),
)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const searchStatFamilyAtom = atomFamily((stat: keyof AugmentStat) =>
  atomWithReset(""),
)

export const searchStatAtom = atom(
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
  (_get, set, update: AugmentStat | typeof RESET) => {
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
      const target = update[key] // Thanks eslint
      if (target) {
        set(a, target.toString())
      }
    })
  },
)

export const searchNameAtom = atomWithReset("")
const availableAugmentsAtom = atom((get) => {
  const activeCategories = allAugmentCategories.map((s) => ({
    category: s,
    active: get(augmentCategoryStateFamilyAtom(s)),
  }))

  const searchStat = get(searchStatAtom)
  const searchName = get(searchNameAtom).toLocaleLowerCase()
  let filteredAugments = activeCategories.reduce(
    (augs, c) => augs.concat(c.active ? augmentByCategory[c.category] : []),
    [] as Augment[],
  )

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
