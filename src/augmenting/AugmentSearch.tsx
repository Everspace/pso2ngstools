import {
  allAugmentCategories,
  AugmentCategory,
  AugmentStat,
  augmentStatToDisplayInfo,
} from "./data/augment"
import { Box, Paper, Tab, Tabs, TextField } from "@mui/material"
import { SearchInput } from "components/SearchInput"
import {
  augmentCategoryStateAtom,
  searchNameAtom,
  searchStatFamilyAtom,
} from "./augmentSearchState"
import { useAtom } from "jotai"
import { useCallback } from "react"

type AugmentStatFieldSearchProps = {
  stat: keyof AugmentStat
}

function AugmentStatFieldSearch({ stat }: AugmentStatFieldSearchProps) {
  const { Glyph, name } = augmentStatToDisplayInfo[stat]
  const [value, setSearch] = useAtom(searchStatFamilyAtom(stat))
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(event.target.value)
    },
    [setSearch],
  )

  return (
    <Box sx={{ display: "flex", alignItems: "flex-end" }}>
      {Glyph ? <Glyph sx={{ color: "action.active", mr: 1, my: 0.5 }} /> : null}
      <TextField
        value={value}
        InputLabelProps={{ shrink: value !== "" }}
        onChange={handleChange}
        label={name}
        variant="standard"
      />
    </Box>
  )
}

const searchables: (keyof AugmentStat)[] = [
  "hp",
  "pp",
  "meleePotency",
  "rangedPotency",
  "techPotency",
]
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
        <SearchInput label="Name" atom={searchNameAtom} />
        {searchables.map((s) => (
          <AugmentStatFieldSearch key={s} stat={s} />
        ))}
      </Box>

      <Tabs value={category} onChange={handleChange}>
        {allAugmentCategories.map((c) => (
          <Tab key={c} label={c} value={c} />
        ))}
      </Tabs>
    </Paper>
  )
}
