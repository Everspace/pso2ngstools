import { SingleAugmentDisplay } from "./AugmentCapsuleDisplay/SingleAugmentLine"
import { MultiAugmentDisplay } from "./AugmentCapsuleDisplay/MultiAugmentLine"
import { Box, Paper, Stack, Typography } from "@mui/material"
import { AugmentSearch } from "./AugmentCapsuleDisplay/AugmentSearch"
import { augmentGroupsAtom } from "./AugmentCapsuleDisplay/augmentSearchState"
import { useAtomValue } from "jotai/react"
import { Augment } from "./types"

function CapsuleList() {
  const augmentGroups = useAtomValue(augmentGroupsAtom)

  if (augmentGroups.length === 0) {
    return (
      <Typography mt={2} mx={2}>
        Nothing Found.
      </Typography>
    )
  }

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
    <Paper>
      <Stack gap={2} p={2}>
        <Typography variant="h5">Augment Search</Typography>
        <Box>
          <AugmentSearch />
          <CapsuleList />
        </Box>
      </Stack>
    </Paper>
  )
}
