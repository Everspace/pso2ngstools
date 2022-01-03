import {
  Autocomplete,
  AutocompleteChangeReason,
  Box,
  Grid,
  TextField,
} from "@mui/material"
import { allAugments } from "augmenting/data/augments"
import {
  AugmentableSlot,
  useAugmentable,
} from "augmenting/state/augmentableState"
import { Augment } from "augmenting/types"
import { useCallback } from "react"

type AugmentLineProps = {
  augment?: Augment
  number: number
  slot: AugmentableSlot
}

function augmentToName(augment: Augment) {
  return augment.name
}

function augmentEqual(a: Augment, b: Augment) {
  return a.name === b.name
}

function AugmentLine({ augment, number, slot }: AugmentLineProps) {
  const { augments, removeAugment, addAugment } = useAugmentable(slot)

  const handleAutocompleteChange = useCallback(
    (_, v: Augment | null, reason: AutocompleteChangeReason) => {
      const augment = augments[number]
      switch (reason) {
        case "clear":
        case "removeOption":
          return augment && removeAugment(augment)
      }
      if (augment) removeAugment(augment)
      if (v) addAugment(v)
    },
    [addAugment, augments, removeAugment, number],
  )

  return (
    <Autocomplete
      clearOnBlur
      clearOnEscape
      autoComplete={false}
      disablePortal
      filterSelectedOptions
      options={allAugments}
      value={augment || null}
      isOptionEqualToValue={augmentEqual}
      onChange={handleAutocompleteChange}
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          {augmentToName(option)}
        </Box>
      )}
      getOptionLabel={(aug) => `${aug.name} - ${aug.rate * 10}%`}
      renderInput={(params) => (
        <TextField {...params} label={`Augment #${number + 1}`} />
      )}
    />
  )
}

type AugmentSlotListProps = {
  slot: AugmentableSlot
}

export function AugmentSlotList({ slot }: AugmentSlotListProps) {
  const { augments, max } = useAugmentable(slot)

  const displayEmpty = augments.length < max

  return (
    <Grid container spacing={2}>
      {augments.map((aug, index) => (
        <Grid key={`${slot}aug${index}`} item xs={12}>
          <AugmentLine slot={slot} number={index} augment={aug} />
        </Grid>
      ))}
      {displayEmpty ? (
        <Grid item xs={12}>
          <AugmentLine
            slot={slot}
            number={augments.length}
            key={`${slot}aug${augments.length}`}
          />
        </Grid>
      ) : null}
    </Grid>
  )
}
