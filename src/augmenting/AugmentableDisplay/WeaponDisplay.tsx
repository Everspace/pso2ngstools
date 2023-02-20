import {
  Autocomplete,
  Box,
  createFilterOptions,
  Grid,
  TextField,
} from "@mui/material"
import { useAtomValue, useSetAtom } from "jotai"
import {
  weaponPotentialAtom,
  weaponStateAtom,
} from "augmenting/state/equipmentState"
import { allWeapons } from "augmenting/data/weapons"
import { useCallback } from "react"
import { Weapon } from "augmenting/types"
import { AugmentibleDisplay } from "./AugmentableDisplay"
import { range } from "lodash"
import { GrindDropdown } from "./GrindDropdown"
import { ListDropdown } from "components/ListDropdown"
import { MAX_POTENTIAL } from "augmenting/data/consts"

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
  const weapon = useAtomValue(weaponStateAtom)
  const setWeaponState = useSetAtom(weaponStateAtom)
  const handleAutocompleteChange = useCallback(
    (_: any, v: Weapon | null) => {
      const weapon = v ?? allWeapons["None"]
      setWeaponState(weapon)
    },
    [setWeaponState],
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

const potentialLevels = range(0, MAX_POTENTIAL + 1)
function WeaponConfig() {
  return (
    <Grid container spacing={1}>
      <Grid item container spacing={1} xs={12}>
        <Grid item>
          <GrindDropdown slot="weapon" />
        </Grid>
        <Grid item xs={4}>
          <ListDropdown
            label="Potential"
            options={potentialLevels}
            atom={weaponPotentialAtom}
            handleUpdate={Number}
          />
        </Grid>
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
