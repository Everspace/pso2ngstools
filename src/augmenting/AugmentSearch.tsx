import { allAugmentCategories, AugmentCategory } from "./data/augment"
import { Box, Paper, Tab, Tabs } from "@mui/material"
import { SearchInput } from "components/SearchInput"
import { augmentCategoryStateAtom, searchNameAtom } from "./augmentSearchState"
import { useAtom } from "jotai"
import { useCallback } from "react"

export function AugmentSearch() {
  const [category, setCategory] = useAtom(augmentCategoryStateAtom)

  const handleChange = useCallback(
    (event, newValue: AugmentCategory) => {
      setCategory(newValue)
    },
    [setCategory],
  )

  return (
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
  )
}
