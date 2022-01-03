import { Stack, Box, Typography, Button, Paper } from "@mui/material"
import { atom, useAtom } from "jotai"
import { AugmentCategoryDisplay } from "./AugmentCapsuleDisplay"
import { AugmentStatDisplay } from "./AugmentStatDisplay"
import { allAugmentsAtom } from "./state/augmentableState"
import { AugmentStat } from "./types"
import { sumAugmentStats } from "./tools"
import { useAllAugments } from "./useAllAugments"
import { ChangeAugmentSlotsDropdown } from "./ChangeAugmentSlotsDropdown"
import { CharacterBPDisplay } from "./CharacterDisplay"
import { WeaponDisplay } from "./AugmentableDisplay/WeaponDisplay"
import { UnitDisplay } from "./AugmentableDisplay/UnitDisplay"
import { bpTotalAtom } from "./state/bpState"

const statTotalAtom = atom<AugmentStat>((get) =>
  sumAugmentStats(get(allAugmentsAtom)),
)

export function AugmentPanel() {
  const { clearAllAugments, randomizeAllAugments } = useAllAugments()
  const [stats] = useAtom(statTotalAtom)
  const [bp] = useAtom(bpTotalAtom)

  return (
    <Stack>
      <Box mb={1}>
        <Typography variant="h3">Augmenting</Typography>
        <Button onClick={randomizeAllAugments}>Randomize</Button>
        <Button color="error" onClick={clearAllAugments}>
          Clear All
        </Button>
      </Box>
      <Box>
        <ChangeAugmentSlotsDropdown />
      </Box>
      <Box mt={2} mb={3} pb={1}>
        <CharacterBPDisplay />
      </Box>
      <Box
        mb={-1}
        sx={(theme) => ({
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gridTemplateRows: "auto",
          gap: 1,
          gridTemplateAreas: `
            "weapon unit1"
            "unit2 unit3"
          `,
          [theme.breakpoints.down("md")]: {
            gridTemplateColumns: "1fr",
            gridTemplateAreas: `
              "weapon"
              "unit1"
              "unit2"
              "unit3"
            `,
          },
        })}
      >
        <Box sx={{ gridArea: "weapon" }}>
          <WeaponDisplay />
        </Box>
        <Box sx={{ gridArea: "unit1" }}>
          <UnitDisplay slot="unit1" />
        </Box>
        <Box sx={{ gridArea: "unit2" }}>
          <UnitDisplay slot="unit2" />
        </Box>
        <Box sx={{ gridArea: "unit3" }}>
          <UnitDisplay slot="unit3" />
        </Box>
      </Box>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h5">Total: {bp} BP</Typography>
        <AugmentStatDisplay simple stat={stats} />
      </Paper>
      <AugmentCategoryDisplay />
    </Stack>
  )
}
