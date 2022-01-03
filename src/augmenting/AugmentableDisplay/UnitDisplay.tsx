import {
  Autocomplete,
  Box,
  Button,
  createFilterOptions,
  TextField,
} from "@mui/material"
import { useAtom } from "jotai"
import { unitStateFamily } from "augmenting/state/equipmentState"
import { useCallback } from "react"
import { Unit, UnitSlot } from "augmenting/types"
import { allUnits } from "augmenting/data/armours"
import { AugmentibleDisplay } from "./AugmentableDisplay"
import { augmentSlotNiceName } from "augmenting/info"

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
  const [{ unit, fullyGround }, setUnitState] = useAtom(unitStateFamily(slot))
  const handleAutocompleteChange = useCallback(
    (_, v: Unit | null) => {
      const unit = v ?? allUnits["None"]
      setUnitState({ unit, fullyGround })
    },
    [setUnitState, fullyGround],
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
      renderInput={(params) => (
        <TextField {...params} label={augmentSlotNiceName[slot]} />
      )}
    />
  )
}

type UnitConfigProps = {
  slot: UnitSlot
}
function UnitConfig({ slot }: UnitConfigProps) {
  const [{ fullyGround }, setUnitState] = useAtom(unitStateFamily(slot))
  const toggleGrind = useCallback(
    () =>
      setUnitState((prior) => ({ ...prior, fullyGround: !prior.fullyGround })),
    [setUnitState],
  )
  return (
    <>
      <Button
        variant={fullyGround ? "contained" : "outlined"}
        size="small"
        onClick={toggleGrind}
      >
        Full Grind
      </Button>
    </>
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
      configure={UnitConfig}
    />
  )
}
