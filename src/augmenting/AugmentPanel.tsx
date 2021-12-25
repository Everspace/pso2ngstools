import { Stack, Box, Typography, Grid, Button, Paper } from "@mui/material"
import { atom, useAtom } from "jotai"
import { AugmentibleDisplay } from "./AugmentableDisplay"
import { AugmentCategoryDisplay } from "./AugmentCapsuleDisplay"
import { AugmentStatDisplay } from "./AugmentStatDisplay"
import {
  allAugmentsAtom,
  augmentSlots,
  MAX_AUGMENTS_PER_SLOT,
} from "./state/augmentableState"
import { range } from "lodash"
import { AugmentStat } from "./types"
import { sumAugmentStats } from "./tools"
import { useAllAugments } from "./useAllAugments"
import { ChangeAugmentSlotsDropdown } from "./ChangeAugmentSlotsDropdown"
import { CharacterDisplay } from "./CharacterDisplay"

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
          {augmentSlots.map((slot) => (
            <Grid xs={6} md={3} item key={slot}>
              <AugmentibleDisplay slot={slot} />
            </Grid>
          ))}
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
