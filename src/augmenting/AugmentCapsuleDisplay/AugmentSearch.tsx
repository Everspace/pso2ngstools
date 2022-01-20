import {
  Button,
  Grid,
  IconButton,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material"
import { SearchInput } from "components/SearchInput"
import {
  augmentCategoryStateAtom,
  augmentSearchCategories,
  SearchAugmentCategory,
  searchNameAtom,
  searchStatAtom,
  searchStatFamilyAtom,
} from "./augmentSearchState"
import { useAtom } from "jotai"
import { useCallback } from "react"
import { augmentStatToDisplayInfo } from "augmenting/info"
import { AugmentStat } from "augmenting/types"
import { Replay } from "@mui/icons-material"
import { useResetAtom } from "jotai/utils"

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
    <Grid
      container
      direction="row"
      justifyContent="flex-start"
      alignItems="center"
    >
      {Glyph ? (
        <Grid item>
          <Glyph sx={{ color: "action.active", mr: 1, my: 0.5 }} />
        </Grid>
      ) : null}
      <Grid item xs>
        <TextField
          size="small"
          value={value}
          InputLabelProps={{ shrink: value !== "" }}
          onChange={handleChange}
          label={shortName ?? name}
        />
      </Grid>
    </Grid>
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
  const resetSearch = useResetAtom(searchStatAtom)
  return (
    <Paper>
      <Grid container px={2} pb={2} rowSpacing={1}>
        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="baseline"
          columnSpacing={1}
          item
          xs={12}
        >
          <Grid item>
            <Typography variant="h5">Augment Search</Typography>
          </Grid>
          <Grid item>
            <SearchInput label="Name" atom={searchNameAtom} />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container>
            <Grid item>
              <Tooltip
                arrow
                enterDelay={100}
                title="Show augments with at least this much of a stat"
              >
                <span>
                  <Typography
                    variant="h6"
                    sx={{
                      borderBottomStyle: "dotted",
                      borderBottomWidth: 1,
                    }}
                  >
                    Stat Search
                  </Typography>
                </span>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip title="Reset Search">
                <IconButton onClick={resetSearch}>
                  <Replay />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          container
          direction="row"
          justifyContent="flex-start"
          spacing={1}
          xs={12}
        >
          {searchables.map((s) => (
            // TODO: proper grid to break this into multiple rows at large sizes
            <Grid item key={s} xs={4} sm={4} md={2}>
              <AugmentStatFieldSearch stat={s} />
            </Grid>
          ))}
        </Grid>
        <Grid item xs={12}>
          {/* Reset area around the H6 */}
          <Grid container>
            <Tooltip
              arrow
              enterDelay={100}
              title='only 1 per family, except "basic" augments'
            >
              <span>
                <Typography
                  variant="h6"
                  sx={{
                    borderBottomStyle: "dotted",
                    borderBottomWidth: 1,
                  }}
                >
                  Augment Family
                </Typography>
              </span>
            </Tooltip>
          </Grid>
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
