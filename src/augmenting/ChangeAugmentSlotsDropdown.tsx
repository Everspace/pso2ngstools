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
import { useAllAugments } from "./useAllAugments"

const augmentSlotNumberArray = range(1, MAX_AUGMENTS_PER_SLOT + 1)
export function ChangeAugmentSlotsDropdown() {
  const [augmentsPerSlot, setAugmentsPerSlot] = useAtom(augmentsPerSlotAtom)
  const { truncateAllAugments } = useAllAugments()
  const handleSetAugmentSlots = useCallback(
    (e: SelectChangeEvent) => {
      if (typeof e.target.value === "number") {
        setAugmentsPerSlot(e.target.value)
        truncateAllAugments(e.target.value)
      }
    },
    [setAugmentsPerSlot, truncateAllAugments],
  )

  return (
    <FormControl size="small" sx={{ m: 1, minWidth: 100 }}>
      <InputLabel>Aug # Max</InputLabel>
      <Select
        label="Augment"
        onChange={handleSetAugmentSlots}
        value={augmentsPerSlot.toString()}
      >
        {augmentSlotNumberArray.map((i) => (
          <MenuItem key={i} value={i}>
            {i}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
