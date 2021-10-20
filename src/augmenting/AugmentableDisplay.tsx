import { Circle, Delete } from "@mui/icons-material"
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  List,
  ListItem,
  Typography,
} from "@mui/material"
import { AugmentStatDisplay } from "./AugmentStatDisplay"
import { AugmentableSlot, augmentSlotNiceName, useAugmentable } from "./state"

export interface AugmentibleDisplayProps {
  slot: AugmentableSlot
}

export const AugmentibleDisplay = ({ slot }: AugmentibleDisplayProps) => {
  const { augments, clearAugments, removeAugment, max } = useAugmentable(slot)
  const leftSlots = max - augments.length
  const leftover = Array(leftSlots).map((_, index) => index)

  return (
    <Card>
      <CardHeader
        title={augmentSlotNiceName[slot]}
        action={<Button onClick={clearAugments}>Clear</Button>}
      />
      <CardContent>
        <List dense>
          {augments.map((c) => (
            <ListItem key={c.name}>
              <IconButton
                size="small"
                color="error"
                onClick={() => removeAugment(c)}
              >
                <Delete />
              </IconButton>
              {c.rate * 10}% - {c.name}
            </ListItem>
          ))}
          {leftover.map((i) => (
            <ListItem>
              <Circle /> Empty Slot {i}
            </ListItem>
          ))}
        </List>
      </CardContent>
      <CardContent>
        <Typography>Stats</Typography>
        <AugmentStatDisplay simple stat={augments} />
      </CardContent>
    </Card>
  )
}
