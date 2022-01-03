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
import { AugmentableSlot, useAugmentable } from "../state/augmentableState"
import { AugmentSlotList } from "./AugmentSlotList"

interface AugmentibleDisplayProps {
  slot: AugmentableSlot
  autocomplete: () => React.ReactNode
}

export function AugmentibleDisplay({
  slot,
  autocomplete,
}: AugmentibleDisplayProps) {
  const { augments, clearAugments } = useAugmentable(slot)

  return (
    <Paper>
      <Grid container p={2} rowSpacing={1}>
        <Grid item xs={12}>
          {autocomplete()}
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
