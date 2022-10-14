import {
  equipStateFamily,
  grindStateFamily,
} from "augmenting/state/equipmentState"
import { AugmentableSlot, GRIND_LEVELS, Unit, Weapon } from "augmenting/types"
import { ListDropdown } from "components/ListDropdown"
import { PrimitiveAtom, useAtomValue } from "jotai"

type GrindDropdownProps = {
  slot: AugmentableSlot
}

export function GrindDropdown({ slot }: GrindDropdownProps) {
  const grindAtom = grindStateFamily(slot) as PrimitiveAtom<number>
  const item = useAtomValue<Weapon | Unit>(equipStateFamily(slot))
  const availableLevels = GRIND_LEVELS.slice(
    0,
    GRIND_LEVELS.indexOf(item.limit_max) + 1,
  )
  return (
    <ListDropdown
      label="Grind +"
      options={availableLevels as number[]}
      atom={grindAtom}
      handleUpdate={Number}
    />
  )
}
