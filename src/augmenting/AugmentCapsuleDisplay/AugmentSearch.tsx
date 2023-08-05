import {
  Button,
  ButtonGroup,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material"
import { SearchInput } from "components/SearchInput"
import {
  augmentCategoryStateFamilyAtom,
  augmentSearchCategories,
  SearchAugmentCategory,
  searchNameAtom,
  searchStatAtom,
  searchStatFamilyAtom,
} from "./augmentSearchState"
import { atom, useAtom, useSetAtom } from "jotai"
import { useCallback } from "react"
import { augmentStatToDisplayInfo } from "augmenting/info"
import { allAugmentCategories, AugmentStat } from "augmenting/types"
import { Replay } from "@mui/icons-material"
import { RESET } from "jotai/utils"

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
  const [active, setActive] = useAtom(augmentCategoryStateFamilyAtom(category))
  const toggle = () => setActive((state) => !state)
  const variant = active ? "contained" : "outlined"

  return (
    <Button variant={variant} onClick={toggle}>
      {category}
    </Button>
  )
}

const allCatAtoms = allAugmentCategories.map(augmentCategoryStateFamilyAtom)

const allActive = atom(
  (get) => {
    return allCatAtoms.map(get).every((b) => b)
  },
  (get, set, update: boolean) => {
    allCatAtoms.forEach((a) => set(a, update))
  },
)

function AllAugmentCategoryButton() {
  const [active, setActive] = useAtom(allActive)
  const variant = active ? "contained" : "outlined"
  const toggle = () => setActive(true)
  return (
    <Button variant={variant} onClick={toggle}>
      All
    </Button>
  )
}

const p2w = ["cashi"]
const p2wlessCategories = allAugmentCategories
  .filter((c) => p2w.indexOf(c) === -1)
  .map(augmentCategoryStateFamilyAtom)

const p2wlessAtom = atom(
  (get) => p2wlessCategories.map(get).every((b) => b),
  (_, set) => {
    p2wlessCategories.map((a) => set(a, true))
  },
)
function NoP2WAugmentCategoryButton() {
  const [active, setActive] = useAtom(p2wlessAtom)
  const variant = active ? "contained" : "outlined"
  const toggle = () => setActive()
  return (
    <Button variant={variant} onClick={toggle}>
      NoP2W
    </Button>
  )
}

function NoneAugmentCategoryButton() {
  const setActive = useSetAtom(allActive)
  const variant = "outlined"
  const toggle = () => setActive(false)
  return (
    <Button variant={variant} onClick={toggle}>
      None
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
    <Grid
      container
      sx={{ borderBottom: 1, borderColor: "text.disabled" }}
      pb={2}
      rowSpacing={1}
    >
      <Grid item xs={12}>
        <SearchInput
          label="Name"
          placeholder="Chungus Soul LXIX"
          atom={searchNameAtom}
        />
      </Grid>
      <Grid item xs={12}>
        <AugmentStatSearchHeader />
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
        <AugmentFamilyHeader />
      </Grid>
      <Grid container item spacing={1}>
        <Grid item key="all">
          <ButtonGroup>
            <AllAugmentCategoryButton />
            <NoP2WAugmentCategoryButton />
            <NoneAugmentCategoryButton />
          </ButtonGroup>
        </Grid>
        {augmentSearchCategories.map((c) => (
          <Grid item key={c}>
            <AugmentSearchCategoryButton category={c} />
          </Grid>
        ))}
      </Grid>
    </Grid>
  )
}

function AugmentStatSearchHeader() {
  const doAtom = useSetAtom(searchStatAtom)
  const resetSearch = () => doAtom(RESET)
  return (
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
  )
}

function AugmentFamilyHeader() {
  return (
    <Grid container>
      <Tooltip
        arrow
        enterDelay={100}
        title='only 1 per family, except "Unknown" augments'
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
  )
}
