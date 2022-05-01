import { grindStateFamily } from "augmenting/state/equipmentState"
import { AugmentableSlot, GRIND_LEVELS } from "augmenting/types"
import { ListDropdown } from "components/ListDropdown"
import { PrimitiveAtom } from "jotai"

type GrindDropdownProps = {
  slot: AugmentableSlot
}

export function GrindDropdown({ slot }: GrindDropdownProps) {
  const grindAtom = grindStateFamily(slot) as PrimitiveAtom<number>

  return (
    <ListDropdown
      label="Grind +"
      options={[...GRIND_LEVELS] as number[]}
      atom={grindAtom}
      handleUpdate={Number}
    />
  )
}
