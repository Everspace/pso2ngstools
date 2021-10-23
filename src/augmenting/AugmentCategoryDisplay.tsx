import { groupBy } from "lodash"
import { useCallback } from "react"
import { SingleAugmentDisplay } from "./SingleAugmentDisplay"
import {
  allAugmentCategories,
  Augment,
  augmentByCategory,
  AugmentCategory,
  augmentFufillsRequirement,
  AugmentStat,
} from "./data/augment"
import { MultiAugmentDisplay } from "./MultiAugmentDisplay"
import { Box, Paper, Stack, Tab, Tabs } from "@mui/material"
import { SearchInput } from "components/SearchInput"
import { atom, useAtom } from "jotai"
import { atomWithReset } from "jotai/utils"

const augmentCategoryStateAtom = atom<AugmentCategory>(allAugmentCategories[0])
const searchStatAtom = atomWithReset<AugmentStat | null>(null)
const searchNameAtom = atomWithReset("")

const availableAugments = atom<Augment[]>((get) => {
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

const CategoryPane = () => {
  const [augments] = useAtom(availableAugments)

  const groups = groupBy(augments, (a) => (a.baseName ? a.baseName : a.name))

  return (
    <Box>
      <Box>
        <Stack>
          {Object.entries(groups)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([group, augments]) =>
              augments.length === 1 ? (
                <SingleAugmentDisplay key={group} augment={augments[0]} />
              ) : (
                <MultiAugmentDisplay key={group} augments={augments} />
              ),
            )}
        </Stack>
      </Box>
    </Box>
  )
}

export const AugmentCategoryDisplay = () => {
  const [category, setCategory] = useAtom(augmentCategoryStateAtom)

  const handleChange = useCallback(
    (event, newValue: AugmentCategory) => {
      setCategory(newValue)
    },
    [setCategory],
  )

  return (
    <>
      <Paper>
        <Box px={1}>
          <SearchInput atom={searchNameAtom} />
        </Box>
        <Tabs value={category} onChange={handleChange}>
          {allAugmentCategories.map((c) => (
            <Tab key={c} label={c} value={c} />
          ))}
        </Tabs>
      </Paper>
      <CategoryPane />
    </>
  )
}
