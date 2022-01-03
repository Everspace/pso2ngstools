import {
  Autocomplete,
  AutocompleteChangeReason,
  Box,
  createFilterOptions,
  Grid,
  TextField,
} from "@mui/material"
import { allAugments } from "augmenting/data/augments"
import {
  addAugmentAtomFamily,
  augmentableFamily,
  removeAugmentAtomFamily,
} from "augmenting/state/augmentableState"
import { augmentsPerSlotAtom } from "augmenting/state/equipmentState"
import { Augment, AugmentableSlot } from "augmenting/types"
import { useAtomValue, useUpdateAtom } from "jotai/utils"
import { useCallback } from "react"

type AugmentLineProps = {
  augment?: Augment
  number: number
  slot: AugmentableSlot
}

function augmentToName(augment: Augment) {
  return `${augment.name} - ${augment.stat.bp ?? "??"} BP `
}

function augmentEqual(a: Augment, b: Augment) {
  return a.name === b.name
}

const filteropts = createFilterOptions<Augment>({
  stringify: augmentToName,
})

function AugmentLine({ augment, number, slot }: AugmentLineProps) {
  const augments = useAtomValue(augmentableFamily(slot))
  const removeAugment = useUpdateAtom(removeAugmentAtomFamily(slot))
  const addAugment = useUpdateAtom(addAugmentAtomFamily(slot))

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
      filterOptions={filteropts}
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

const slotListSize = 6

export function AugmentSlotList({ slot }: AugmentSlotListProps) {
  const augments = useAtomValue(augmentableFamily(slot))
  const max = useAtomValue(augmentsPerSlotAtom)

  const displayEmpty = augments.length < max

  return (
    <Grid container spacing={2}>
      {augments.map((aug, index) => (
        <Grid key={`${slot}aug${index}`} item xs={slotListSize}>
          <AugmentLine slot={slot} number={index} augment={aug} />
        </Grid>
      ))}
      {displayEmpty ? (
        <Grid item xs={slotListSize}>
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
