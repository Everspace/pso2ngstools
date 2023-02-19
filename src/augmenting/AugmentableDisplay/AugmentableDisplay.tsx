import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Grid,
  Paper,
  Typography,
} from "@mui/material"
import { ExpandMore } from "@mui/icons-material"
import { AugmentStatDisplay } from "../AugmentStatDisplay"
import { AugmentableSlot, Unit, Weapon } from "augmenting/types"
import { AugmentSlotList } from "./AugmentSlotList"
import { augmentSlotNiceName } from "augmenting/info"
import {
  augmentableFamily,
  clearAugmentFamily,
  sumEquipStats,
} from "augmenting/state/augmentableState"
import { useAtomValue } from "jotai/react"
import { CopyAugmentButton } from "./CopyAugmentButton"
import useTransitionedAtom from "hooks/useTransitionedAtom"
import { Suspense } from "react"
import {
  equipStateFamily,
  grindStateFamily,
  weaponPotentialAtom,
} from "augmenting/state/equipmentState"
import { zero } from "MathConstants"
import { getAugmentBp, getUnitBp, getWeaponBp } from "augmenting/bpCalc"

type BpHeaderProps = {
  slot: AugmentableSlot
}

function BpHeader({ slot }: BpHeaderProps) {
  const augments = useAtomValue(augmentableFamily(slot))

  const equip = useAtomValue(equipStateFamily(slot))
  const grind = useAtomValue(grindStateFamily(slot))
  const potential = useAtomValue(weaponPotentialAtom)
  let bp = zero.add(getAugmentBp(augments))

  if (slot === "weapon") {
    bp = bp.add(getWeaponBp({ weapon: equip as Weapon, grind, potential }))
  } else {
    bp = bp.add(getUnitBp({ unit: equip as Unit, grind }))
  }

  return (
    <Typography>
      {augmentSlotNiceName[slot]}: {bp.toNumber()} BP
    </Typography>
  )
}

type StatDisplayProps = {
  slot: AugmentableSlot
}

function StatDisplay({ slot }: StatDisplayProps) {
  const equip = useAtomValue(equipStateFamily(slot))
  const augments = useAtomValue(augmentableFamily(slot))

  let stat = sumEquipStats(equip, augments)

  return (
    <Accordion
      disabled={stat === null}
      TransitionProps={{ unmountOnExit: true }}
    >
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography>Stat total</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {stat && <AugmentStatDisplay simple stat={stat} />}
      </AccordionDetails>
    </Accordion>
  )
}

interface AugmentibleDisplayProps {
  slot: AugmentableSlot
  autocomplete: React.ReactNode
  configure?: React.ReactNode
}

export function AugmentibleDisplay({
  slot,
  autocomplete,
  configure,
}: AugmentibleDisplayProps) {
  const [, clearAugments] = useTransitionedAtom(clearAugmentFamily(slot))
  return (
    <Suspense>
      <Paper>
        <Grid container>
          <Grid item p={2} px={2} xs={12}>
            <BpHeader slot={slot} />
          </Grid>
          <Grid item py={1} px={2} xs={12}>
            {autocomplete}
          </Grid>
          <Grid item py={1} px={2} xs={12}>
            {configure}
          </Grid>
          <Grid item xs={12}>
            <Accordion
              defaultExpanded
              TransitionProps={{ unmountOnExit: true }}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography>Augments</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={1} mb={2}>
                  <Grid item xs="auto">
                    <CopyAugmentButton from={slot} to="all" />
                  </Grid>
                  <Grid item xs="auto">
                    <CopyAugmentButton from={slot} to="units" />
                  </Grid>
                </Grid>
                <Box>
                  <AugmentSlotList slot={slot} />
                </Box>
                <Box mt={1}>
                  <Button
                    sx={{ float: "right" }}
                    color="error"
                    onClick={() => clearAugments()}
                  >
                    Clear Augments
                  </Button>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Grid>

          <Grid item xs={12}>
            <StatDisplay slot={slot} />
          </Grid>
        </Grid>
      </Paper>
    </Suspense>
  )
}
