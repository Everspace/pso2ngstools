import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Typography,
} from "@mui/material"
import { useAtom } from "jotai"
import { AugmentStatDisplay } from "../AugmentStatDisplay"
import {
  augmentSlotNiceName,
  UnitSlot,
  useAugmentable,
} from "augmenting/state/augmentableState"
import { unitStateFamily } from "augmenting/state/equipmentState"
import { useCallback } from "react"
import { Unit } from "augmenting/types"
import { AugmentSlotList } from "./AugmentSlotList"
import { allUnits } from "augmenting/data/armours"

const unitSelections: Unit[] = Object.keys(allUnits)
  .sort((a, b) => allUnits[a].stars - allUnits[b].stars)
  .map((key) => allUnits[key])
  .reverse()

function unitToName(w: Unit) {
  return `${w.stars}⭐ ${w.name}`
}

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
      options={unitSelections}
      value={unit}
      onChange={handleAutocompleteChange}
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

type UnitDisplayProps = {
  slot: UnitSlot
}
export function UnitDisplay({ slot }: UnitDisplayProps) {
  const { augments, clearAugments } = useAugmentable(slot)

  return (
    <Card>
      <CardHeader
        title={<UnitAutocomplete slot={slot} />}
        action={
          <Button color="error" onClick={clearAugments}>
            Clear
          </Button>
        }
      />
      <CardContent>
        <AugmentSlotList slot="weapon" />
      </CardContent>
      {augments.length > 0 ? (
        <CardContent>
          <Typography>Stats</Typography>
          <AugmentStatDisplay simple stat={augments} />
        </CardContent>
      ) : null}
    </Card>
  )
}
