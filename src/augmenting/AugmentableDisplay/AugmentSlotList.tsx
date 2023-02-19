import {
  Autocomplete,
  AutocompleteChangeReason,
  Box,
  createFilterOptions,
  FilterOptionsState,
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
import useTransitionedAtom from "hooks/useTransitionedAtom"
import { atom } from "jotai"
import { atomFamily } from "jotai/utils"
import { useAtomValue } from "jotai/react"
import { compare } from "mathjs"

type AugmentLineProps = {
  augment?: Augment
  number: number
  slot: AugmentableSlot
}

function augmentToName(augment: Augment) {
  return `${augment.name} - ${augment.stat.bp?.toNumber() ?? "??"} BP`
}

function augmentEqual(a: Augment, b: Augment) {
  return a.name === b.name
}

const defaultFilter = createFilterOptions<Augment>({
  stringify: augmentToName,
})

type Filterer<T> = (options: T[], state: FilterOptionsState<T>) => T[]
const filterer: Filterer<Augment> = (options, state) => {
  if (state.inputValue.trim() === "") return []
  return defaultFilter(options, state)
    .sort((a, b) => compare(a.stat.bp ?? 0, b.stat.bp ?? 0) as number)
    .reverse()
    .slice(0, 20)
}

const updateAugmentAtom = atomFamily((params: AugmentLineProps) => {
  const { number, slot } = params
  const augmentsAtom = augmentableFamily(slot)
  const removeAtom = removeAugmentAtomFamily(slot)
  const addAtom = addAugmentAtomFamily(slot)
  return atom(
    null,
    (
      get,
      set,
      update: { v: Augment | null; reason: AutocompleteChangeReason },
    ) => {
      const { v, reason } = update
      const augment = get(augmentsAtom)[number]
      console.log(reason, v)
      switch (reason) {
        case "clear":
          return set(removeAtom, augment)
        case "removeOption":
          return augment && set(removeAtom, augment)
        case "selectOption":
          if (v) set(addAtom, v)
      }
    },
  )
})

function AugmentLine({ augment, number, slot }: AugmentLineProps) {
  const [, handleChange] = useTransitionedAtom(
    updateAugmentAtom({ number, slot }),
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
      filterOptions={filterer}
      isOptionEqualToValue={augmentEqual}
      onChange={(_, v, reason) => handleChange({ v, reason })}
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          {augmentToName(option)}
        </Box>
      )}
      getOptionLabel={(aug) =>
        `${aug.name} (${aug.stat.bp?.toNumber() ?? "??"} BP) - ${
          aug.rate * 10
        }%`
      }
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
  const augments = useAtomValue(augmentableFamily(slot))
  const max = useAtomValue(augmentsPerSlotAtom)

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
