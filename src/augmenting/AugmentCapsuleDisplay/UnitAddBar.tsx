import { Button, ButtonGroup, List, ListItem } from "@mui/material"
import {
  Augment,
  AugmentableSlot,
  augmentSlots,
  unitSlots,
} from "augmenting/types"
import { flatten, includes } from "lodash"
import { useMemo } from "react"
import { augmentSlotNiceName } from "augmenting/info"
import {
  addAugmentAtomFamily,
  allAugmentsAtom,
  augmentableFamily,
  removeAugmentAtomFamily,
} from "augmenting/state/augmentableState"

import { atomFamily } from "jotai/utils"
import { atom, useAtomValue, useSetAtom } from "jotai"

type TakesAugment = { augment: Augment }

const atomAddToUnits = atom(null, (_get, set, update: Augment) => {
  unitSlots.map(addAugmentAtomFamily).map((a) => set(a, update))
})

function useAddToAllUnits(augment: Augment) {
  const addToAll = useSetAtom(atomAddToAll)
  return useMemo(() => () => addToAll(augment), [addToAll, augment])
}

const allUnitAugments = atom((get) =>
  flatten(unitSlots.map(addAugmentAtomFamily).map(get)),
)

const useAddToUnitsButton = (augment: Augment) => {
  const add = useSetAtom(atomAddToUnits)
  const augments = useAtomValue(allUnitAugments)

  const addToUnits = useMemo(() => () => add(augment), [add, augment])
  const hasAny = useMemo(() => includes(augments, augment), [augment, augments])

  return {
    hasAny,
    addToUnits,
  }
}

const atomAddToAll = atom(null, (_get, set, update: Augment) => {
  augmentSlots.map(addAugmentAtomFamily).map((a) => set(a, update))
})

const atomRemoveFromAll = atom(null, (_get, set, update: Augment) => {
  augmentSlots.map(removeAugmentAtomFamily).map((a) => set(a, update))
})

const useRemoveAllButton = (augment: Augment) => {
  const remove = useSetAtom(atomRemoveFromAll)
  const augments = useAtomValue(allAugmentsAtom)
  const removeAll = useMemo(() => () => remove(augment), [remove, augment])

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
  atom(null, (get, set, augment: Augment) => {
    const isExistant = get(isExistantAtom({ slot, augment }))
    const optAtom = isExistant ? removeAugmentAtomFamily : addAugmentAtomFamily
    set(optAtom(slot), augment)
  }),
)

function AugmentableSlotToggleButton({
  augment,
  slot,
}: TakesAugment & { slot: AugmentableSlot }) {
  const isExsitant = useAtomValue(isExistantAtom({ slot, augment }))
  const toggle = useSetAtom(toggleOnAugmentSlotAtom(slot))

  const onClick = () => {
    toggle(augment)
  }

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
