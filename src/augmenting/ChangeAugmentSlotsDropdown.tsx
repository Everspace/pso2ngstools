import {
  Select,
  MenuItem,
  SelectChangeEvent,
  FormControl,
  InputLabel,
} from "@mui/material"
import { useAtom } from "jotai"
import { augmentsPerSlotAtom } from "./state/augmentableState"
import { useCallback } from "react"
import { useAllAugments } from "./useAllAugments"
import { numbers } from "./AugmentPanel"

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
    <FormControl size="small" variant="standard" sx={{ m: 1 }}>
      <InputLabel>Aug #</InputLabel>
      <Select
        label="Augment"
        onChange={handleSetAugmentSlots}
        value={augmentsPerSlot.toString()}
      >
        {numbers.map((i) => (
          <MenuItem key={i} value={i}>
            {i}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
