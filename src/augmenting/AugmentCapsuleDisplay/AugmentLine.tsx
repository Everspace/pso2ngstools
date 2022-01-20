import { Box, Grid } from "@mui/material"
import { UnitAddBar } from "./UnitAddBar"
import { AugmentStatDisplay } from "../AugmentStatDisplay"
import { AugmentCapsuleImage } from "./MultiAugmentLine"
import { Augment } from "augmenting/types"

export function AugmentLineHeader({ children }: React.PropsWithChildren<{}>) {
  return (
    <Grid item xs={12}>
      {children}
    </Grid>
  )
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
      <Grid container spacing={2}>
        <Grid xs={2} sm={2} md={1} maxWidth={256} item>
          <AugmentCapsuleImage augment={augment} />
        </Grid>
        <Grid xs item>
          <Grid container>
            {children}
            <Grid item xs={12}>
              <AugmentStatDisplay stat={augment.stat} />
            </Grid>
            <Grid item xs={12}>
              <UnitAddBar augment={augment} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}
