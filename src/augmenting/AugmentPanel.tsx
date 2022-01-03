import { Stack, Box, Typography, Grid, Button, Paper } from "@mui/material"
import { atom, useAtom } from "jotai"
import { AugmentCategoryDisplay } from "./AugmentCapsuleDisplay"
import { AugmentStatDisplay } from "./AugmentStatDisplay"
import {
  allAugmentsAtom,
  MAX_AUGMENTS_PER_SLOT,
} from "./state/augmentableState"
import { range } from "lodash"
import { AugmentStat } from "./types"
import { sumAugmentStats } from "./tools"
import { useAllAugments } from "./useAllAugments"
import { ChangeAugmentSlotsDropdown } from "./ChangeAugmentSlotsDropdown"
import { CharacterDisplay } from "./CharacterDisplay"
import { ChangeLevelDropdown } from "./ChangeLevelDropdown"
import { ChangeClassDropdown } from "./ChangeClassDropdown"
import { WeaponDisplay } from "./AugmentableDisplay/WeaponDisplay"
import { UnitDisplay } from "./AugmentableDisplay/UnitDisplay"

const statTotalAtom = atom<AugmentStat>((get) =>
  sumAugmentStats(get(allAugmentsAtom)),
)

export const numbers = range(1, MAX_AUGMENTS_PER_SLOT + 1)
export function AugmentPanel() {
  const { clearAllAugments, randomizeAllAugments } = useAllAugments()
  const [stats] = useAtom(statTotalAtom)

  return (
    <Stack spacing={1}>
      <Box>
        <Typography variant="h3">Augmenting</Typography>
        <Button onClick={randomizeAllAugments}>Randomize</Button>
        <Button color="error" onClick={clearAllAugments}>
          Clear All
        </Button>
      </Box>
      <Box>
        <ChangeAugmentSlotsDropdown />
        <ChangeLevelDropdown />
        <ChangeClassDropdown />
      </Box>
      <Box>
        <CharacterDisplay />
      </Box>
      <Box>
        <Grid
          container
          direction="row"
          justifyContent="space-evenly"
          alignItems="baseline"
          spacing={2}
        >
          <Grid xs={12} md={6} item>
            <WeaponDisplay />
          </Grid>
          <Grid xs={12} md={6} item>
            <UnitDisplay slot="unit1" />
          </Grid>
          <Grid xs={12} md={6} item>
            <UnitDisplay slot="unit2" />
          </Grid>
          <Grid xs={12} md={6} item>
            <UnitDisplay slot="unit3" />
          </Grid>
        </Grid>
      </Box>
      <Paper sx={{ m: 2, p: 2 }}>
        <Typography variant="h5">Total</Typography>
        <AugmentStatDisplay simple stat={stats} />
      </Paper>
      <AugmentCategoryDisplay />
    </Stack>
  )
}
