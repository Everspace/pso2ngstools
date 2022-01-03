import { Box, Button, Grid, Paper, TextField, Typography } from "@mui/material"
import { SearchInput } from "components/SearchInput"
import {
  augmentCategoryStateAtom,
  augmentSearchCategories,
  SearchAugmentCategory,
  searchNameAtom,
  searchStatFamilyAtom,
} from "./augmentSearchState"
import { useAtom } from "jotai"
import { useCallback } from "react"
import { augmentStatToDisplayInfo } from "augmenting/info"
import { AugmentStat } from "augmenting/types"

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

type AugmentSearchCategoryButtonProps = { category: SearchAugmentCategory }
function AugmentSearchCategoryButton({
  category,
}: AugmentSearchCategoryButtonProps) {
  const [currentCategory, setCategory] = useAtom(augmentCategoryStateAtom)
  const handleChange = useCallback(
    () => setCategory(category),
    [setCategory, category],
  )

  const variant = category === currentCategory ? "contained" : "outlined"

  return (
    <Button variant={variant} onClick={handleChange}>
      {category}
    </Button>
  )
}

const searchables: (keyof AugmentStat)[] = [
  "bp",
  "hp",
  "pp",
  "meleePotency",
  "rangedPotency",
  "techPotency",
]

export function AugmentSearch() {
  return (
    <Paper>
      <Grid container p={2} rowSpacing={1}>
        <Grid item container spacing={2}>
          <Grid item>
            <SearchInput label="Name" atom={searchNameAtom} />
          </Grid>
          {searchables.map((s) => (
            <Grid item xs={3} lg={1} key={s}>
              <AugmentStatFieldSearch stat={s} />
            </Grid>
          ))}
        </Grid>
        <Grid item xs={12}>
          <Typography>
            Augment Family:{" "}
            <em>(only 1 per family, except "basic" augments)</em>
          </Typography>
        </Grid>
        <Grid container item spacing={1}>
          {augmentSearchCategories.map((c) => (
            <Grid item key={c}>
              <AugmentSearchCategoryButton category={c} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Paper>
  )
}
