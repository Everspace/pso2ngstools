import { Button, ButtonGroup, List, ListItem } from "@mui/material"
import { Augment } from "augmenting/types"
import {
  AugmentableSlot,
  augmentSlotNiceName,
  useAugmentable,
} from "augmenting/augmentableState"
import { flatten, includes } from "lodash"
import { useMemo, useCallback } from "react"

const useAddToAllButton = (augment: Augment) => {
  const { addAugment: addToWeapon } = useAugmentable("weapon")
  const { addAugment: addToUnit1 } = useAugmentable("unit1")
  const { addAugment: addToUnit2 } = useAugmentable("unit2")
  const { addAugment: addToUnit3 } = useAugmentable("unit3")

  return useCallback(() => {
    addToWeapon(augment)
    addToUnit1(augment)
    addToUnit2(augment)
    addToUnit3(augment)
  }, [addToUnit1, addToUnit2, addToUnit3, addToWeapon, augment])
}

const useAddToUnitsButton = (augment: Augment) => {
  const { addAugment: addToUnit1, augments: unit1 } = useAugmentable("unit1")
  const { addAugment: addToUnit2, augments: unit2 } = useAugmentable("unit2")
  const { addAugment: addToUnit3, augments: unit3 } = useAugmentable("unit3")

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
  const { augments: weapon, removeAugment: removeToWeapon } =
    useAugmentable("weapon")
  const { augments: unit1, removeAugment: removeToUnit1 } =
    useAugmentable("unit1")
  const { augments: unit2, removeAugment: removeToUnit2 } =
    useAugmentable("unit2")
  const { augments: unit3, removeAugment: removeToUnit3 } =
    useAugmentable("unit3")

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
  const { augments, removeAugment, addAugment } = useAugmentable(slot)

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
