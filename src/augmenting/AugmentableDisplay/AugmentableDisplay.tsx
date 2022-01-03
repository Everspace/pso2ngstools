import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Grid,
  Paper,
  Typography,
} from "@mui/material"
import { ExpandMore } from "@mui/icons-material"
import { AugmentStatDisplay } from "../AugmentStatDisplay"
import { useAugmentable } from "../state/augmentableState"
import { AugmentableSlot } from "augmenting/types"
import { AugmentSlotList } from "./AugmentSlotList"
import { augmentSlotNiceName } from "augmenting/info"

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
  const { augments, clearAugments } = useAugmentable(slot)

  return (
    <Paper>
      <Grid container px={2} spacing={2}>
        <Grid item xs={12}>
          <Typography>{augmentSlotNiceName[slot]}</Typography>
        </Grid>
        <Grid item xs={12}>
          {autocomplete}
        </Grid>
        <Grid item xs={12}>
          <Typography>Config:</Typography>
        </Grid>
        <Grid item xs={12}>
          {configure}
        </Grid>
        <Grid item xs={12}>
          <Typography>Augments:</Typography>
        </Grid>
        <Grid item xs={12}>
          <AugmentSlotList slot={slot} />
        </Grid>
        <Grid item xs={12}>
          <Button sx={{ float: "right" }} color="error" onClick={clearAugments}>
            Clear Augments
          </Button>
        </Grid>
      </Grid>
      <Accordion
        disabled={augments.length === 0}
        TransitionProps={{ unmountOnExit: true }}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Stat total</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {augments.length > 0 ? (
            <AugmentStatDisplay simple stat={augments} />
          ) : null}
        </AccordionDetails>
      </Accordion>
    </Paper>
  )
}
