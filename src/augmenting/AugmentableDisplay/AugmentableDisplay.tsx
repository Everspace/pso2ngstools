import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Paper,
  Stack,
  Typography,
} from "@mui/material"
import { ExpandMore } from "@mui/icons-material"
import { AugmentStatDisplay } from "../AugmentStatDisplay"
import { AugmentableSlot } from "augmenting/types"
import { AugmentSlotList } from "./AugmentSlotList"
import { augmentSlotNiceName } from "augmenting/info"
import { equipBpFamily } from "augmenting/state/bpState"
import {
  augmentableFamily,
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
  const augments = useAtomValue(augmentableFamily(slot))
  const clearAugments = useUpdateAtom(clearAugmentFamily(slot))
  const bp = useAtomValue(equipBpFamily(slot))

  return (
    <Paper>
      <Stack p={2} spacing={2}>
        <Box>
          <Typography>
            {augmentSlotNiceName[slot]}: {bp} BP
          </Typography>
        </Box>
        <Box>{autocomplete}</Box>
        <Box>
          <Typography>Config:</Typography>
        </Box>
        <Box sx={{ height: "3em" }}>{configure}</Box>
        <Box>
          <Typography>Augments:</Typography>
        </Box>
        <Box>
          <AugmentSlotList slot={slot} />
        </Box>
        <Box>
          <Button sx={{ float: "right" }} color="error" onClick={clearAugments}>
            Clear Augments
          </Button>
        </Box>
      </Stack>
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
