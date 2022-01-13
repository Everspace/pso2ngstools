import {
  Select,
  MenuItem,
  SelectChangeEvent,
  FormControl,
  InputLabel,
} from "@mui/material"
import { useAtom } from "jotai"
import { range } from "lodash"
import { useCallback } from "react"
import {
  augmentsPerSlotAtom,
  MAX_AUGMENTS_PER_SLOT,
} from "./state/equipmentState"

const augmentSlotNumberArray = range(1, MAX_AUGMENTS_PER_SLOT + 1)
export function ChangeAugmentSlotsDropdown() {
  const [augmentsPerSlot, setAugmentsPerSlot] = useAtom(augmentsPerSlotAtom)
  const handleSetAugmentSlots = useCallback(
    (e: SelectChangeEvent) => {
      setAugmentsPerSlot(Number(e.target.value))
    },
    [setAugmentsPerSlot],
  )

  return (
    <FormControl size="small" sx={{ minWidth: 100 }}>
      <InputLabel>Aug # Max</InputLabel>
      <Select
        label="Augment"
        onChange={handleSetAugmentSlots}
        value={augmentsPerSlot.toString()}
      >
        {augmentSlotNumberArray.map((i) => (
          <MenuItem key={i} value={i.toString()}>
            {i}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
