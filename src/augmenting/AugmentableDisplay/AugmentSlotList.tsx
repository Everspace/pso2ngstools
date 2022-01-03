import { Delete } from "@mui/icons-material"
import { IconButton, List, ListItem } from "@mui/material"
import {
  AugmentableSlot,
  useAugmentable,
} from "augmenting/state/augmentableState"

type AugmentSlotListProps = {
  slot: AugmentableSlot
}

export function AugmentSlotList({ slot }: AugmentSlotListProps) {
  const { augments, removeAugment, max } = useAugmentable(slot)
  const allSlots = Array.from(Array(max).keys())
  return (
    <List dense>
      {allSlots.map((_, index) => {
        const aug = augments[index]
        if (!aug) {
          return (
            <ListItem key={`empty ${index}`}>
              <IconButton disabled size="small">
                <Delete />
              </IconButton>
              Empty Slot
            </ListItem>
          )
        }
        return (
          <ListItem key={aug.name}>
            <IconButton
              size="small"
              color="error"
              onClick={() => removeAugment(aug)}
            >
              <Delete />
            </IconButton>
            {aug.rate * 10}% - {aug.name}
          </ListItem>
        )
      })}
    </List>
  )
}
