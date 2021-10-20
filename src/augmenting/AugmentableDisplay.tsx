import { Circle, Delete } from "@mui/icons-material"
import {
  Button,
  Card,
  CardContent,
  CardHeader,
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
      <CardContent>
        <CardHeader>
          {augmentSlotNiceName[slot]}
          <Button onClick={clearAugments}>Clear</Button>
        </CardHeader>
      </CardContent>
      <CardContent>
        <List>
          {augments.map((c) => (
            <ListItem key={c.name}>
              <Delete />
              {/* <Icon
                link
                inline
                // color="red"
                name="x"
                onClick={() => removeAugment(c)}
              /> */}
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
