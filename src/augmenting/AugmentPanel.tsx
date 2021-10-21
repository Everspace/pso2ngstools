import { Stack, Box, Typography, Grid, Button, Paper } from "@mui/material"
import { useAtom } from "jotai"
import { AugmentibleDisplay } from "./AugmentableDisplay"
import { augmentByCategory, AugmentCategory } from "./data/augment"
import { AugmentCategoryDisplay } from "./AugmentCategoryDisplay"
import { AugmentStatDisplay } from "./AugmentStatDisplay"
import { augmentSlots, statTotalAtom, useAugmentable } from "./state"
import _ from "lodash"
import { useCallback } from "react"

function useAllAugments() {
  const { setAugments: setunit1Augments } = useAugmentable("unit1")
  const { setAugments: setunit2Augments } = useAugmentable("unit2")
  const { setAugments: setunit3Augments } = useAugmentable("unit3")
  const { setAugments: setweaponAugments } = useAugmentable("weapon")
  const randomizeAllAugments = useCallback(() => {
    const categories = _.sampleSize(
      Object.keys(augmentByCategory),
      4,
    ) as AugmentCategory[]
    const augments = categories.map(
      (category) => _.sample(augmentByCategory[category]!)!,
    )

    setunit1Augments(augments)
    setunit2Augments(augments)
    setunit3Augments(augments)
    setweaponAugments(augments)
  }, [setunit1Augments, setunit2Augments, setunit3Augments, setweaponAugments])

  const clearAllAugments = useCallback(() => {
    setunit1Augments([])
    setunit2Augments([])
    setunit3Augments([])
    setweaponAugments([])
  }, [setunit1Augments, setunit2Augments, setunit3Augments, setweaponAugments])

  return {
    randomizeAllAugments,
    clearAllAugments,
  }
}

export const AugmentPanel = () => {
  const { clearAllAugments, randomizeAllAugments } = useAllAugments()
  const [stats] = useAtom(statTotalAtom)
  return (
    <Stack spacing={1}>
      <Box>
        <Typography variant="h3">Augmenting</Typography>
        <Button onClick={randomizeAllAugments}>Randomize</Button>
        <Button color="error" onClick={clearAllAugments}>
          Clear All
        </Button>
      </Box>
      <Box>
        <Grid
          container
          direction="row"
          justifyContent="space-evenly"
          alignItems="baseline"
          spacing={2}
        >
          {augmentSlots.map((slot) => (
            <Grid xs={6} md={3} item key={slot}>
              <AugmentibleDisplay slot={slot} />
            </Grid>
          ))}
        </Grid>
      </Box>
      <Paper sx={{ m: 2, p: 2 }}>
        <Typography variant="h5">Total</Typography>
        <AugmentStatDisplay simple stat={stats} />
      </Paper>
      <AugmentCategoryDisplay />
    </Stack>
  )
}
