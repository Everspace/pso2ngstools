import { Stack, Box, Typography, Button, Paper } from "@mui/material"
import { AugmentCategoryDisplay } from "./AugmentCapsuleDisplay"
import { AugmentStatDisplay } from "./AugmentStatDisplay"
import {
  allAugmentableSlotStatSum,
  augmentableSlotStatSum,
} from "./state/augmentableState"
import { useAllAugments } from "./useAllAugments"
import { ChangeAugmentSlotsDropdown } from "./ChangeAugmentSlotsDropdown"
import { CharacterBPDisplay } from "./CharacterDisplay"
import { WeaponDisplay } from "./AugmentableDisplay/WeaponDisplay"
import { UnitDisplay } from "./AugmentableDisplay/UnitDisplay"
import { bpTotalAtom } from "./state/bpState"
import { useAtomValue } from "jotai/utils"
import { weaponStateAtom } from "./state/equipmentState"
import { rangeFromWeaponAugments, WeaponRange } from "./tools"
import { AugmentPanelHelm } from "./AugmentPanelHelm"
import { SxProps, Theme } from "@mui/system"

function rangeToLine({ min, max }: WeaponRange): string {
  return `${min.mul(100).toFixed(1)}% - ${max.mul(100).toFixed(1)}%`
}

function WeaponRangeLine() {
  const weapon = useAtomValue(weaponStateAtom)
  const weaponStats = useAtomValue(augmentableSlotStatSum("weapon"))
  const realStats = useAtomValue(allAugmentableSlotStatSum)
  const weaponRange = rangeFromWeaponAugments(weapon, weaponStats)
  const realRange = rangeFromWeaponAugments(weapon, realStats)

  return (
    <Typography>
      Weapon Range: {rangeToLine(realRange)} (displayed:{" "}
      {rangeToLine(weaponRange)})
    </Typography>
  )
}

const augmentableDisplayGrid: SxProps<Theme> = (theme) => ({
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gridTemplateRows: "auto",
  gap: 1,
  gridTemplateAreas: `"weapon unit1 unit2 unit3"`,
  [theme.breakpoints.down("lg")]: {
    gridTemplateColumns: "repeat(2, 1fr)",
    gridTemplateAreas: `
      "weapon unit1"
      "unit2 unit3"
    `,
  },
  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "1fr",
    gridTemplateAreas: `
      "weapon"
      "unit1"
      "unit2"
      "unit3"
    `,
  },
})

export default function AugmentPanel() {
  const { clearAllAugments, randomizeAllAugments } = useAllAugments()
  const stats = useAtomValue(allAugmentableSlotStatSum)
  const bp = useAtomValue(bpTotalAtom)

  return (
    <>
      <AugmentPanelHelm />
      <Stack spacing={1}>
        <Box>
          <Typography variant="h3">Augmenting</Typography>
          <Typography variant="subtitle1">Total: {bp} BP</Typography>
          <Button onClick={randomizeAllAugments}>Randomize</Button>
          <Button color="error" onClick={clearAllAugments}>
            Clear All
          </Button>
        </Box>
        <Box>
          <ChangeAugmentSlotsDropdown />
        </Box>
        <Box>
          <CharacterBPDisplay />
        </Box>
        <Box sx={augmentableDisplayGrid}>
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
          <Typography variant="h4">Total: {bp} BP</Typography>
          <WeaponRangeLine />
          {stats && <AugmentStatDisplay simple stat={stats} />}
        </Paper>
        <AugmentCategoryDisplay />
      </Stack>
    </>
  )
}
