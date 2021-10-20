import { Stack, Box, Typography, Grid, Divider, Button } from "@mui/material"
import { useAtom } from "jotai"
import { AugmentibleDisplay } from "./AugmentableDisplay"
import { augmentByCategory, AugmentCategory } from "./data/augment"
// import { AugmentCategoryDisplay } from "./AugmentCategoryDisplay"
import { AugmentStatDisplay } from "./AugmentStatDisplay"
import { augmentSlots, statTotalAtom, useAugmentable } from "./state"
import _ from "lodash"
import { useCallback } from "react"

function useRandomAugments() {
  const { setAugments: setunit1Augments } = useAugmentable("unit1")
  const { setAugments: setunit2Augments } = useAugmentable("unit2")
  const { setAugments: setunit3Augments } = useAugmentable("unit3")
  const { setAugments: setweaponAugments } = useAugmentable("weapon")
  return useCallback(() => {
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
}

export const AugmentPanel = () => {
  const func = useRandomAugments()
  const [stats] = useAtom(statTotalAtom)
  return (
    <Stack spacing={1}>
      <Box>
        <Typography variant="h3">Augmenting</Typography>
        <Button onClick={func}>Randomize</Button>
      </Box>
      <Grid container spacing={2}>
        {augmentSlots.map((slot) => (
          <Grid md={3} item key={slot}>
            <AugmentibleDisplay slot={slot} />
          </Grid>
        ))}
      </Grid>
      <Divider />
      <Box>
        <Typography variant="h5">Total</Typography>
        <AugmentStatDisplay simple stat={stats} />
      </Box>
      <Divider />
      {/* <AugmentCategoryDisplay /> */}
    </Stack>
  )
}
