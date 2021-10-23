import { groupBy } from "lodash"
import { useCallback } from "react"
import { SingleAugmentDisplay } from "./SingleAugmentDisplay"
import { allAugmentCategories, AugmentCategory } from "./data/augment"
import { MultiAugmentDisplay } from "./MultiAugmentDisplay"
import { Box, Paper, Stack, Tab, Tabs } from "@mui/material"
import { SearchInput } from "components/SearchInput"
import { useAtom } from "jotai"
import {
  availableAugments,
  augmentCategoryStateAtom,
  searchNameAtom,
} from "./augmentSearchState"

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
