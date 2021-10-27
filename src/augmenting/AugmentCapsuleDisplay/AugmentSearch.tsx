import {
  allAugmentCategories,
  AugmentCategory,
  AugmentStat,
  augmentStatToDisplayInfo,
} from "../data/augment"
import { Box, Grid, Paper, Tab, Tabs, TextField } from "@mui/material"
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
  const { Glyph, name, shortName } = augmentStatToDisplayInfo[stat]
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
        label={shortName ?? name}
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
      <Grid px={3} container spacing={2}>
        <SearchInput label="Name" atom={searchNameAtom} />
        {searchables.map((s) => (
          <Grid item xs={2} lg={1} key={s}>
            <AugmentStatFieldSearch stat={s} />
          </Grid>
        ))}
      </Grid>

      <Tabs value={category} onChange={handleChange}>
        {allAugmentCategories.map((c) => (
          <Tab key={c} label={c} value={c} />
        ))}
      </Tabs>
    </Paper>
  )
}
