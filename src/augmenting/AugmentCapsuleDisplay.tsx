import { SingleAugmentDisplay } from "./AugmentCapsuleDisplay/SingleAugmentLine"
import { MultiAugmentDisplay } from "./AugmentCapsuleDisplay/MultiAugmentLine"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
  Typography,
} from "@mui/material"
import { AugmentSearch } from "./AugmentCapsuleDisplay/AugmentSearch"
import { augmentGroupsAtom } from "./AugmentCapsuleDisplay/augmentSearchState"
import { useAtomValue } from "jotai/react"
import { Augment } from "./types"
import { ExpandMore } from "@mui/icons-material"

function CapsuleList() {
  const augmentGroups = useAtomValue(augmentGroupsAtom)

  return (
    <Stack>
      {augmentGroups.map(([groupName, augments]) =>
        augments.length === 1 ? (
          <SingleAugmentDisplay key={groupName} augment={augments[0]} />
        ) : (
          <MultiAugmentDisplay
            key={groupName}
            augments={augments as [Augment, ...Augment[]]}
          />
        ),
      )}
    </Stack>
  )
}

export function AugmentCapsuleDisplay() {
  return (
    <Accordion TransitionProps={{ unmountOnExit: true, timeout: 500 }}>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography variant="h5">Augment Search</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <AugmentSearch />
        <CapsuleList />
      </AccordionDetails>
    </Accordion>
  )
}
