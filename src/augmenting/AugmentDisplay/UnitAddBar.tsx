import { Augment } from "augmenting/data/augment"
import {
  AugmentableSlot,
  augmentSlotNiceName,
  augmentSlots,
  useAugmentable,
} from "augmenting/state"
import { flatten, includes } from "lodash"
import { useMemo } from "react"
import { Button, ButtonGroup } from "semantic-ui-react"

interface WithAugment {
  augment: Augment
}

const AddToAllButton = ({ augment }: WithAugment) => {
  const { addAugment: addToWeapon } = useAugmentable("weapon")
  const { addAugment: addToUnit1 } = useAugmentable("unit1")
  const { addAugment: addToUnit2 } = useAugmentable("unit2")
  const { addAugment: addToUnit3 } = useAugmentable("unit3")

  const addToAll = () => {
    addToWeapon(augment)
    addToUnit1(augment)
    addToUnit2(augment)
    addToUnit3(augment)
  }

  return (
    <Button color="blue" onClick={addToAll}>
      Add All
    </Button>
  )
}

const RemoveAllButton = ({ augment }: WithAugment) => {
  const { augments: weapon, removeAugment: removeToWeapon } =
    useAugmentable("weapon")
  const { augments: unit1, removeAugment: removeToUnit1 } =
    useAugmentable("unit1")
  const { augments: unit2, removeAugment: removeToUnit2 } =
    useAugmentable("unit2")
  const { augments: unit3, removeAugment: removeToUnit3 } =
    useAugmentable("unit3")

  const removeToAll = () => {
    removeToWeapon(augment)
    removeToUnit1(augment)
    removeToUnit2(augment)
    removeToUnit3(augment)
  }

  const isExsitant = useMemo(
    () => includes(flatten([weapon, unit1, unit2, unit3]), augment),
    [augment, weapon, unit1, unit2, unit3],
  )

  return (
    <Button disabled={!isExsitant} color="red" onClick={removeToAll}>
      Clear
    </Button>
  )
}

interface AugmentToggleButtonProps extends WithAugment {
  slot: AugmentableSlot
}

const AugmentToggleButton = ({ augment, slot }: AugmentToggleButtonProps) => {
  const { augments, removeAugment, addAugment } = useAugmentable(slot)

  const isExsitant = useMemo(
    () => includes(augments, augment),
    [augment, augments],
  )

  return (
    <Button
      color={isExsitant ? "blue" : undefined}
      onClick={() => {
        isExsitant ? removeAugment(augment) : addAugment(augment)
      }}
    >
      {augmentSlotNiceName[slot]}
    </Button>
  )
}

export const UnitAddBar = ({ augment }: WithAugment) => {
  return (
    <ButtonGroup compact>
      {augmentSlots.map((slot) => (
        <AugmentToggleButton key={slot} augment={augment} slot={slot} />
      ))}
      <AddToAllButton augment={augment} />
      <RemoveAllButton augment={augment} />
    </ButtonGroup>
  )
}
