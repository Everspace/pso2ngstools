import { Button, ButtonGroup, List, ListItem } from "@mui/material"
import { Augment, AugmentableSlot } from "augmenting/types"
import { flatten, includes } from "lodash"
import { useMemo, useCallback } from "react"
import { augmentSlotNiceName } from "augmenting/info"
import {
  addAugmentAtomFamily,
  augmentableFamily,
  removeAugmentAtomFamily,
} from "augmenting/state/augmentableState"
import { useAtomValue, useUpdateAtom } from "jotai/utils"

const useAddToAllButton = (augment: Augment) => {
  const addToWeapon = useUpdateAtom(addAugmentAtomFamily("weapon"))
  const addToUnit1 = useUpdateAtom(addAugmentAtomFamily("unit1"))
  const addToUnit2 = useUpdateAtom(addAugmentAtomFamily("unit2"))
  const addToUnit3 = useUpdateAtom(addAugmentAtomFamily("unit3"))

  return useCallback(() => {
    addToWeapon(augment)
    addToUnit1(augment)
    addToUnit2(augment)
    addToUnit3(augment)
  }, [addToUnit1, addToUnit2, addToUnit3, addToWeapon, augment])
}

const useAddToUnitsButton = (augment: Augment) => {
  const addToUnit1 = useUpdateAtom(addAugmentAtomFamily("unit1"))
  const addToUnit2 = useUpdateAtom(addAugmentAtomFamily("unit2"))
  const addToUnit3 = useUpdateAtom(addAugmentAtomFamily("unit3"))
  const unit1 = useAtomValue(augmentableFamily("unit1"))
  const unit2 = useAtomValue(augmentableFamily("unit2"))
  const unit3 = useAtomValue(augmentableFamily("unit3"))

  const hasAny = useMemo(
    () => includes(flatten([unit1, unit2, unit3]), augment),
    [augment, unit1, unit2, unit3],
  )

  const addToUnits = useCallback(() => {
    addToUnit1(augment)
    addToUnit2(augment)
    addToUnit3(augment)
  }, [addToUnit1, addToUnit2, addToUnit3, augment])

  return {
    hasAny,
    addToUnits,
  }
}

const useRemoveAllButton = (augment: Augment) => {
  const removeToWeapon = useUpdateAtom(removeAugmentAtomFamily("weapon"))
  const removeToUnit1 = useUpdateAtom(removeAugmentAtomFamily("unit1"))
  const removeToUnit2 = useUpdateAtom(removeAugmentAtomFamily("unit2"))
  const removeToUnit3 = useUpdateAtom(removeAugmentAtomFamily("unit3"))
  const weapon = useAtomValue(augmentableFamily("weapon"))
  const unit1 = useAtomValue(augmentableFamily("unit1"))
  const unit2 = useAtomValue(augmentableFamily("unit2"))
  const unit3 = useAtomValue(augmentableFamily("unit3"))

  const removeAll = useCallback(() => {
    removeToWeapon(augment)
    removeToUnit1(augment)
    removeToUnit2(augment)
    removeToUnit3(augment)
  }, [augment, removeToUnit1, removeToUnit2, removeToUnit3, removeToWeapon])

  const hasAny = useMemo(
    () => includes(flatten([weapon, unit1, unit2, unit3]), augment),
    [augment, weapon, unit1, unit2, unit3],
  )
  return { removeAll, hasAny }
}

const useAugmentToggle = (augment: Augment, slot: AugmentableSlot) => {
  const augments = useAtomValue(augmentableFamily(slot))
  const addAugment = useUpdateAtom(addAugmentAtomFamily(slot))
  const removeAugment = useUpdateAtom(removeAugmentAtomFamily(slot))

  const isExsitant = useMemo(
    () => includes(augments, augment),
    [augments, augment],
  )

  const onClick = useCallback(() => {
    isExsitant ? removeAugment(augment) : addAugment(augment)
  }, [addAugment, augment, isExsitant, removeAugment])

  const variant: "contained" | "outlined" = isExsitant
    ? "contained"
    : "outlined"
  return {
    variant,
    onClick,
    label: augmentSlotNiceName[slot],
  }
}

export function UnitAddBar({ augment }: { augment: Augment }) {
  const addToAll = useAddToAllButton(augment)
  const { hasAny: hasAnyOnUnits, addToUnits } = useAddToUnitsButton(augment)
  const { hasAny, removeAll } = useRemoveAllButton(augment)
  const { label: unit1Label, ...unit1Props } = useAugmentToggle(
    augment,
    "unit1",
  )
  const { label: unit2Label, ...unit2Props } = useAugmentToggle(
    augment,
    "unit2",
  )
  const { label: unit3Label, ...unit3Props } = useAugmentToggle(
    augment,
    "unit3",
  )
  const { label: weaponLabel, ...weaponProps } = useAugmentToggle(
    augment,
    "weapon",
  )

  return (
    <List dense>
      <ListItem>
        <ButtonGroup disableElevation size="small">
          <Button {...weaponProps}>{weaponLabel}</Button>
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
      <ListItem>
        <ButtonGroup disableElevation size="small">
          <Button {...unit1Props}>{unit1Label}</Button>
          <Button {...unit2Props}>{unit2Label}</Button>
          <Button {...unit3Props}>{unit3Label}</Button>
        </ButtonGroup>
      </ListItem>
    </List>
  )
}
