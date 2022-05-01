import {
  Autocomplete,
  Box,
  Button,
  createFilterOptions,
  Grid,
  TextField,
} from "@mui/material"
import { useAtom, useSetAtom } from "jotai"
import {
  mirrorUnitAtom,
  unitStateFamily,
} from "augmenting/state/equipmentState"
import { useCallback } from "react"
import { Unit, UnitSlot } from "augmenting/types"
import { allUnits } from "augmenting/data/armours"
import { AugmentibleDisplay } from "./AugmentableDisplay"
import { GrindDropdown } from "./GrindDropdown"

const unitSelections: Unit[] = Object.keys(allUnits)
  .sort((a, b) => allUnits[a].stars - allUnits[b].stars)
  .map((key) => allUnits[key])
  .reverse()

function unitToName(u: Unit) {
  return `${u.stars}⭐ ${u.name} - Lv.${u.level}`
}

function unitEqual(a: Unit, b: Unit) {
  return a.name === b.name
}

const filteropts = createFilterOptions<Unit>({
  stringify: unitToName,
})

type UnitAutocompleteProps = {
  slot: UnitSlot
}

function UnitAutocomplete({ slot }: UnitAutocompleteProps) {
  const [unit, setUnitState] = useAtom(unitStateFamily(slot))
  const handleAutocompleteChange = useCallback(
    (_: any, v: Unit | null) => {
      const unit = v ?? allUnits["None"]
      setUnitState(unit)
    },
    [setUnitState],
  )

  return (
    <Autocomplete
      autoComplete={false}
      disablePortal
      disableClearable
      filterSelectedOptions
      options={unitSelections}
      value={unit}
      filterOptions={filteropts}
      onChange={handleAutocompleteChange}
      isOptionEqualToValue={unitEqual}
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          {unitToName(option)}
        </Box>
      )}
      getOptionLabel={unitToName}
      renderInput={(params) => <TextField {...params} label="Name" />}
    />
  )
}

type UnitConfigProps = {
  slot: UnitSlot
}
function UnitConfig({ slot }: UnitConfigProps) {
  const mirror = useSetAtom(mirrorUnitAtom)
  return (
    <Grid
      container
      direction="row"
      justifyContent="flex-start"
      alignItems="center"
      spacing={1}
    >
      <Grid item>
        <GrindDropdown slot={slot} />
      </Grid>
      <Grid item xs>
        <Button
          sx={{ float: "right" }}
          size="small"
          onClick={() => mirror(slot)}
        >
          Mirror Unit
        </Button>
      </Grid>
    </Grid>
  )
}

type UnitDisplayProps = {
  slot: UnitSlot
}
export function UnitDisplay({ slot }: UnitDisplayProps) {
  return (
    <AugmentibleDisplay
      slot={slot}
      autocomplete={<UnitAutocomplete slot={slot} />}
      configure={<UnitConfig slot={slot} />}
    />
  )
}
