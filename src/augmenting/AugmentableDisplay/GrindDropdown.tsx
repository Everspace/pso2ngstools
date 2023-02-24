import {
  equipStateFamily,
  grindStateFamily,
} from "augmenting/state/equipmentState"
import {
  AugmentableSlot,
  GrindLevel,
  GRIND_LEVELS,
  Unit,
  Weapon,
} from "augmenting/types"
import { ListDropdown } from "components/ListDropdown"
import { useAtomValue } from "jotai"

type GrindDropdownProps = {
  slot: AugmentableSlot
}

export function GrindDropdown({ slot }: GrindDropdownProps) {
  const grindAtom = grindStateFamily(slot)
  const item = useAtomValue<Weapon | Unit>(equipStateFamily(slot))
  const availableLevels = GRIND_LEVELS.slice(
    0,
    GRIND_LEVELS.indexOf(item.limit_max) + 1,
  )
  return (
    <ListDropdown
      label="Grind +"
      options={availableLevels}
      atom={grindAtom}
      handleUpdate={(s) => Number(s) as GrindLevel}
    />
  )
}
