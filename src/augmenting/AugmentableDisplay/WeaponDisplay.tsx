import {
  Autocomplete,
  Box,
  Checkbox,
  createFilterOptions,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material"
import { useAtom } from "jotai"
import { weaponStateAtom } from "augmenting/state/equipmentState"
import { allWeapons } from "augmenting/data/weapons"
import { useCallback } from "react"
import { Weapon } from "augmenting/types"
import { AugmentibleDisplay } from "./AugmentableDisplay"
import { range } from "lodash"

const weaponSelections = Object.keys(allWeapons)
  .sort((a, b) => allWeapons[a].stars - allWeapons[b].stars)
  .map((key) => allWeapons[key])
  .reverse()

function weaponToName(w: Weapon) {
  return `${w.stars}⭐ ${w.name} - Lv.${w.level}`
}

const filteropts = createFilterOptions<Weapon>({
  stringify: weaponToName,
})

function WeaponAutocomplete() {
  const [{ weapon, fullyGround, potential }, setWeaponState] =
    useAtom(weaponStateAtom)
  const handleAutocompleteChange = useCallback(
    (_, v: Weapon | null) => {
      const weapon = v ?? allWeapons["None"]
      setWeaponState({ weapon, fullyGround, potential })
    },
    [setWeaponState, fullyGround, potential],
  )

  return (
    <Autocomplete
      autoComplete={false}
      disablePortal
      disableClearable
      options={weaponSelections}
      value={weapon}
      filterOptions={filteropts}
      onChange={handleAutocompleteChange}
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          {weaponToName(option)}
        </Box>
      )}
      getOptionLabel={weaponToName}
      renderInput={(params) => <TextField {...params} label="Name" />}
    />
  )
}

const potentialLevels = range(0, 5)
function ChangePotentialDropdown() {
  const [{ potential }, setWeaponState] = useAtom(weaponStateAtom)
  const handleSetAugmentSlots = useCallback(
    (e: SelectChangeEvent<number>) => {
      const value = e.target.value
      if (typeof value === "number") {
        setWeaponState((prior) => ({ ...prior, potential: value }))
      }
    },
    [setWeaponState],
  )

  return (
    <FormControl fullWidth>
      <InputLabel>Potential</InputLabel>
      <Select
        label="Potential"
        typeof="number"
        onChange={handleSetAugmentSlots}
        value={potential}
      >
        {potentialLevels.map((i) => (
          <MenuItem key={i} value={i}>
            {i}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

function WeaponConfig() {
  const [{ fullyGround }, setWeaponState] = useAtom(weaponStateAtom)
  const toggleGrind = useCallback(
    () =>
      setWeaponState((prior) => ({
        ...prior,
        fullyGround: !prior.fullyGround,
      })),
    [setWeaponState],
  )

  return (
    <Grid container>
      <Grid item>
        <FormControlLabel
          sx={{ mt: 1 }}
          control={
            <Checkbox
              size="small"
              checked={fullyGround}
              onClick={toggleGrind}
            />
          }
          label="Full Grind"
        />
      </Grid>
      <Grid item xs={3} lg={2}>
        <ChangePotentialDropdown />
      </Grid>
    </Grid>
  )
}

export function WeaponDisplay() {
  return (
    <AugmentibleDisplay
      slot="weapon"
      autocomplete={<WeaponAutocomplete />}
      configure={<WeaponConfig />}
    />
  )
}
