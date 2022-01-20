import { Button, ButtonGroup, List, ListItem } from "@mui/material"
import {
  Augment,
  AugmentableSlot,
  augmentSlots,
  unitSlots,
} from "augmenting/types"
import { flatten, includes } from "lodash"
import { useMemo, useCallback } from "react"
import { augmentSlotNiceName } from "augmenting/info"
import {
  addAugmentAtomFamily,
  allAugmentsAtom,
  augmentableFamily,
  removeAugmentAtomFamily,
} from "augmenting/state/augmentableState"
import { atomFamily, useAtomValue, useUpdateAtom } from "jotai/utils"
import { atom } from "jotai"

type TakesAugment = { augment: Augment }

const atomAddToUnits = atom<void, Augment>(undefined, (get, set, update) => {
  unitSlots.map(addAugmentAtomFamily).map((a) => set(a, update))
})

function useAddToAllUnits(augment: Augment) {
  const addToAll = useUpdateAtom(atomAddToAll)
  return useCallback(() => addToAll(augment), [addToAll, augment])
}

const allUnitAugments = atom((get) =>
  flatten(unitSlots.map(addAugmentAtomFamily).map(get)),
)

const useAddToUnitsButton = (augment: Augment) => {
  const add = useUpdateAtom(atomAddToUnits)
  const augments = useAtomValue(allUnitAugments)

  const addToUnits = useCallback(() => add(augment), [add, augment])
  const hasAny = useMemo(() => includes(augments, augment), [augment, augments])

  return {
    hasAny,
    addToUnits,
  }
}

const atomAddToAll = atom<void, Augment>(undefined, (get, set, update) => {
  augmentSlots.map(addAugmentAtomFamily).map((a) => set(a, update))
})

const atomRemoveFromAll = atom<void, Augment>(undefined, (get, set, update) => {
  augmentSlots.map(removeAugmentAtomFamily).map((a) => set(a, update))
})

const useRemoveAllButton = (augment: Augment) => {
  const remove = useUpdateAtom(atomRemoveFromAll)
  const augments = useAtomValue(allAugmentsAtom)
  const removeAll = useCallback(() => remove(augment), [remove, augment])

  const hasAny = useMemo(() => includes(augments, augment), [augment, augments])

  return { removeAll, hasAny }
}

type ExistantAtomOpts = {
  slot: AugmentableSlot
  augment: Augment
}
const isExistantAtom = atomFamily(
  ({ slot, augment }: ExistantAtomOpts) => {
    const slotAtom = augmentableFamily(slot)
    return atom((get) => {
      const augments = get(slotAtom)
      return includes(augments, augment)
    })
  },
  (a, b) => a.slot === b.slot && a.augment.name === b.augment.name,
)

const toggleOnAugmentSlotAtom = atomFamily((slot: AugmentableSlot) =>
  atom<undefined, Augment>(undefined, (get, set, augment) => {
    const isExistant = get(isExistantAtom({ slot, augment }))
    const optAtom = isExistant ? addAugmentAtomFamily : removeAugmentAtomFamily
    set(optAtom(slot), augment)
  }),
)

function AugmentableSlotToggleButton({
  augment,
  slot,
}: TakesAugment & { slot: AugmentableSlot }) {
  const isExsitant = useAtomValue(isExistantAtom({ slot, augment }))
  const toggle = useUpdateAtom(toggleOnAugmentSlotAtom(slot))

  const onClick = useCallback(() => {
    toggle(augment)
  }, [toggle, augment])

  return (
    <Button onClick={onClick} variant={isExsitant ? "contained" : "outlined"}>
      {augmentSlotNiceName[slot]}
    </Button>
  )
}

export function UnitAddBar({ augment }: TakesAugment) {
  const addToAll = useAddToAllUnits(augment)
  const { hasAny: hasAnyOnUnits, addToUnits } = useAddToUnitsButton(augment)
  const { hasAny, removeAll } = useRemoveAllButton(augment)

  return (
    <List dense>
      <ListItem disableGutters>
        <ButtonGroup disableElevation size="small">
          <AugmentableSlotToggleButton slot="weapon" augment={augment} />
          <Button
            variant={hasAnyOnUnits ? "contained" : "outlined"}
            onClick={addToUnits}
          >
            All Units
          </Button>
          <Button onClick={addToAll}>Add All</Button>
          <Button
            color="error"
            variant="contained"
            disabled={!hasAny}
            onClick={removeAll}
          >
            Clear All
          </Button>
        </ButtonGroup>
      </ListItem>
      <ListItem disableGutters>
        <ButtonGroup disableElevation size="small">
          <AugmentableSlotToggleButton slot="unit1" augment={augment} />
          <AugmentableSlotToggleButton slot="unit2" augment={augment} />
          <AugmentableSlotToggleButton slot="unit3" augment={augment} />
        </ButtonGroup>
      </ListItem>
    </List>
  )
}
