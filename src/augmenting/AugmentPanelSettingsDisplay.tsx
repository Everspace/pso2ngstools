import {
  Typography,
  AccordionDetails,
  Accordion,
  AccordionSummary,
} from "@mui/material"
import { ChangeAugmentSlotsDropdown } from "./ChangeAugmentSlotsDropdown"
import { ExpandMore } from "@mui/icons-material"

export function AugmentPanelSettingsDisplay() {
  return (
    <Accordion TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography>Global Settings</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <ChangeAugmentSlotsDropdown />
      </AccordionDetails>
    </Accordion>
  )
}
