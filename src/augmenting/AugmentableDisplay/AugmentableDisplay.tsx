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
import { AugmentableSlot } from "augmenting/types"
import { AugmentSlotList } from "./AugmentSlotList"
import { augmentSlotNiceName } from "augmenting/info"
import { equipBpFamily } from "augmenting/state/bpState"
import {
  augmentableSlotStatSum,
  clearAugmentFamily,
} from "augmenting/state/augmentableState"
import { useAtomValue } from "jotai/utils"
import { CopyAugmentButton } from "./CopyAugmentButton"
import useTransitionedAtom from "hooks/useTransitionedAtom"
import { Suspense } from "react"

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
  const stat = useAtomValue(augmentableSlotStatSum(slot))
  const [, clearAugments] = useTransitionedAtom(clearAugmentFamily(slot))
  const bp = useAtomValue(equipBpFamily(slot))

  return (
    <Suspense>
      <Paper>
        <Grid container>
          <Grid item p={2} px={2} xs={12}>
            <Typography>
              {augmentSlotNiceName[slot]}: {bp} BP
            </Typography>
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
                    onClick={clearAugments}
                  >
                    Clear Augments
                  </Button>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Grid>

          <Grid item xs={12}>
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
          </Grid>
        </Grid>
      </Paper>
    </Suspense>
  )
}
