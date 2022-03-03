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
import { useUpdateAtom, useAtomValue } from "jotai/utils"

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
  const clearAugments = useUpdateAtom(clearAugmentFamily(slot))
  const bp = useAtomValue(equipBpFamily(slot))

  return (
    <Paper>
      <Grid container>
        <Grid item p={2} xs={12}>
          <Typography>
            {augmentSlotNiceName[slot]}: {bp} BP
          </Typography>
        </Grid>
        <Grid item p={2} xs={12}>
          {autocomplete}
        </Grid>
        <Grid item p={2} xs={12}>
          <Typography>Config:</Typography>
        </Grid>
        <Grid item p={2} xs={12}>
          {configure}
        </Grid>

        <Grid item xs={12}>
          <Accordion defaultExpanded TransitionProps={{ unmountOnExit: true }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>Augments</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box>
                <AugmentSlotList slot={slot} />
              </Box>
              <Box>
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
  )
}
