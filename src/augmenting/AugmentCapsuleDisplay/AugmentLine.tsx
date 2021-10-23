import { Box, Grid, Stack } from "@mui/material"
import { UnitAddBar } from "./UnitAddBar"
import { AugmentStatDisplay } from "../AugmentStatDisplay"
import { AugmentCapsuleImage } from "./MultiAugmentLine"
import { Augment } from "augmenting/data/augment"

export function AugmentLineHeader({ children }: React.PropsWithChildren<{}>) {
  return <Box>{children}</Box>
}

interface AugmentLineProps {
  augment: Augment
}

export function AugmentLine({
  augment,
  children,
}: React.PropsWithChildren<AugmentLineProps>) {
  return (
    <Box sx={{ borderColor: "divider" }} borderBottom={1} py={2} px={1}>
      <Grid container spacing={1}>
        <Grid xs={1} maxWidth={256} item>
          <AugmentCapsuleImage augment={augment} />
        </Grid>
        <Grid xs item>
          <Stack>
            {children}
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
