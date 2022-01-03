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
  useAugmentable,
} from "augmenting/state/augmentableState"
import { weaponStateAtom } from "augmenting/state/equipmentState"
import { allWeapons } from "augmenting/data/weapons"
import { useCallback } from "react"
import { Weapon } from "augmenting/types"
import { AugmentSlotList } from "./AugmentSlotList"

const weaponSelections = Object.keys(allWeapons)
  .sort((a, b) => allWeapons[a].stars - allWeapons[b].stars)
  .map((key) => allWeapons[key])
  .reverse()

function weaponToName(w: Weapon) {
  return `${w.stars}⭐ ${w.name}`
}

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
  const { augments, clearAugments } = useAugmentable("weapon")

  return (
    <Card>
      <CardHeader
        title={<WeaponAutocomplete />}
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
