import { Grid, Stack } from "@mui/material"
import { Box } from "@mui/system"
import { UnitAddBar } from "./AugmentDisplay/UnitAddBar"
import { AugmentStatDisplay } from "./AugmentStatDisplay"
import { Augment } from "./data/augment"
import { AugmentCapsuleImage } from "./MultiAugmentDisplay"

interface SingleAugmentDisplayProps {
  augment: Augment
}

export const SingleAugmentDisplay = ({
  augment,
}: SingleAugmentDisplayProps) => {
  return (
    <Box sx={{ borderColor: "divider" }} borderBottom={1} py={2} px={1}>
      <Grid container spacing={1}>
        <Grid xs={1} maxWidth={256} item>
          <AugmentCapsuleImage augment={augment} />
        </Grid>
        <Grid xs item>
          <Stack>
            <Box>{augment.name}</Box>
            <Box>
              <AugmentStatDisplay stat={augment.stat} />
            </Box>
            <Box>
              <UnitAddBar augment={augment} />
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  )
}
