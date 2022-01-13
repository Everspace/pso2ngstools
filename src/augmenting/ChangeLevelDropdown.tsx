import {
  Select,
  MenuItem,
  SelectChangeEvent,
  FormControl,
  InputLabel,
} from "@mui/material"
import { useAtom } from "jotai"
import { useCallback } from "react"
import { levelAtom, MAX_LEVEL } from "./state/characterState"

const levelArray = Array.from(new Int8Array(MAX_LEVEL).map((_, i) => i + 1))

export function ChangeLevelDropdown() {
  const [level, setLevel] = useAtom(levelAtom)
  const handleChangeLevel = useCallback(
    (e: SelectChangeEvent) => {
      if (typeof e.target.value === "number") {
        setLevel(e.target.value)
      }
    },
    [setLevel],
  )

  return (
    <FormControl size="small">
      <InputLabel>Lv</InputLabel>
      <Select
        label="Level"
        onChange={handleChangeLevel}
        value={level.toString()}
      >
        {levelArray.map((i) => (
          <MenuItem key={i} value={i}>
            {i}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
