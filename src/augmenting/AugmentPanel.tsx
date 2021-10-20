import { Stack, Box, Typography, Grid, Divider } from "@mui/material"
import { useAtom } from "jotai"
// import { AugmentibleDisplay } from "./AugmentableDisplay"
// import { AugmentCategoryDisplay } from "./AugmentCategoryDisplay"
// import { AugmentStatDisplay } from "./AugmentStatDisplay"
import { augmentSlots, statTotalAtom } from "./state"
import { useUrlStorage } from "./useUrlStorage"

export const AugmentPanel = () => {
  useUrlStorage()
  const [stats] = useAtom(statTotalAtom)

  return (
    <Stack>
      <Box>
        <Typography variant="h3">Augmenting</Typography>
      </Box>
      <Grid>
        {augmentSlots.map((slot) => (
          <Grid item key={slot}>
            Hello
            {/* <AugmentibleDisplay slot={slot} /> */}
          </Grid>
        ))}
      </Grid>
      <Divider />
      <Box>
        <Typography variant="h5">Total</Typography>
        {/* <AugmentStatDisplay simple stat={stats} /> */}
      </Box>
      <Divider />
      {/* <AugmentCategoryDisplay /> */}
    </Stack>
  )
}
