import {
  Autocomplete,
  Box,
  createFilterOptions,
  TextField,
} from "@mui/material"
import { useAtom } from "jotai"
import { weaponStateAtom } from "augmenting/state/equipmentState"
import { allWeapons } from "augmenting/data/weapons"
import { useCallback } from "react"
import { Weapon } from "augmenting/types"
import { AugmentibleDisplay } from "./AugmentableDisplay"
import { augmentSlotNiceName } from "augmenting/info"

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
      renderInput={(params) => (
        <TextField {...params} label={augmentSlotNiceName["weapon"]} />
      )}
    />
  )
}

export function WeaponDisplay() {
  return (
    <AugmentibleDisplay
      slot="weapon"
      autocomplete={() => <WeaponAutocomplete />}
    />
  )
}
