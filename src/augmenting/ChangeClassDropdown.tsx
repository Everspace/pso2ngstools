import {
  Select,
  MenuItem,
  SelectChangeEvent,
  FormControl,
  InputLabel,
} from "@mui/material"
import { ClassIcon } from "icons"
import { useAtom } from "jotai"
import { useCallback } from "react"
import { classNameAtom } from "./state/characterState"
import { allClasses, ClassAbbreviation } from "./types"

export function ChangeClassDropdown() {
  const [className, setClassName] = useAtom(classNameAtom)
  const handleClassName = useCallback(
    (e: SelectChangeEvent) => {
      setClassName(e.target.value as ClassAbbreviation)
    },
    [setClassName],
  )

  return (
    <FormControl size="small" sx={{ m: 1 }}>
      <InputLabel>Class</InputLabel>
      <Select label="Class" onChange={handleClassName} value={className}>
        {allClasses.map((i) => (
          <MenuItem key={i} value={i}>
            <ClassIcon shortname={i} /> {i}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
