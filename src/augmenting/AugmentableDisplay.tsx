import { Delete } from "@mui/icons-material"
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
import {
  AugmentableSlot,
  augmentSlotNiceName,
  useAugmentable,
} from "./augmentableState"

export interface AugmentibleDisplayProps {
  slot: AugmentableSlot
}

export const AugmentibleDisplay = ({ slot }: AugmentibleDisplayProps) => {
  const { augments, clearAugments, removeAugment, max } = useAugmentable(slot)
  const allSlots = Array.from(Array(max).keys())

  return (
    <Card>
      <CardHeader
        title={augmentSlotNiceName[slot]}
        action={
          <Button color="error" onClick={clearAugments}>
            Clear
          </Button>
        }
      />
      <CardContent>
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
      </CardContent>
      {augments.length > 0 ? (
        <CardContent>
          <Typography>Stats</Typography>
          <AugmentStatDisplay simple stat={augments} />
        </CardContent>
      ) : null}
    </Card>
  )
}
