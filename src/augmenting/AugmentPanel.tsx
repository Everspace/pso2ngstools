import {
  Stack,
  Box,
  Typography,
  Grid,
  Button,
  Paper,
  Select,
  MenuItem,
  SelectChangeEvent,
  FormControl,
  InputLabel,
} from "@mui/material"
import { useAtom } from "jotai"
import { AugmentibleDisplay } from "./AugmentableDisplay"
import { Augment, augmentByCategory, AugmentCategory } from "./data/augment"
import { AugmentCategoryDisplay } from "./AugmentCapsuleDisplay"
import { AugmentStatDisplay } from "./AugmentStatDisplay"
import {
  augmentSlots,
  augmentsPerSlotAtom,
  MAX_AUGMENTS_PER_SLOT,
  statTotalAtom,
  useAugmentable,
} from "./augmentableState"
import _ from "lodash"
import { useCallback } from "react"

const maxLengthify = (count: number) => (prior: Augment[]) =>
  prior.length > count ? prior.slice(0, count) : prior
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

  const truncateAllAugments = useCallback(
    (count: number) => {
      const func = maxLengthify(count)
      setunit1Augments(func)
      setunit2Augments(func)
      setunit3Augments(func)
      setweaponAugments(func)
    },
    [setunit1Augments, setunit2Augments, setunit3Augments, setweaponAugments],
  )

  return {
    randomizeAllAugments,
    clearAllAugments,
    truncateAllAugments,
  }
}

const numbers = _.range(MAX_AUGMENTS_PER_SLOT)
export const AugmentPanel = () => {
  const { clearAllAugments, randomizeAllAugments, truncateAllAugments } =
    useAllAugments()
  const [stats] = useAtom(statTotalAtom)
  const [augmentsPerSlot, setAugmentsPerSlot] = useAtom(augmentsPerSlotAtom)
  const handleSetAugmentSlots = useCallback(
    (e: SelectChangeEvent) => {
      if (typeof e.target.value === "number") {
        setAugmentsPerSlot(e.target.value)
        truncateAllAugments(e.target.value)
      }
    },
    [setAugmentsPerSlot, truncateAllAugments],
  )

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
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel>Augments #</InputLabel>
          <Select
            label="Augment"
            variant="standard"
            onChange={handleSetAugmentSlots}
            value={augmentsPerSlot.toString()}
          >
            {numbers.map((i) => (
              <MenuItem key={i} value={i}>
                {i}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
