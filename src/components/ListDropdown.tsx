import {
  SelectChangeEvent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material"
import { WritableAtom, useAtom, PrimitiveAtom } from "jotai"
import { Stringable } from "pureTypes"
import { useCallback } from "react"

type BaseListDropdownProps<T extends Stringable> = {
  label: string
  atom: PrimitiveAtom<T> | WritableAtom<T, T>
  options: T[]
}

export type ListDropdownProps<T extends Stringable> = T extends string
  ? BaseListDropdownProps<T>
  : BaseListDropdownProps<T> & {
      handleUpdate: (value: string) => T
    }

export function ListDropdown<T extends Stringable>({
  label,
  atom,
  options,
  handleUpdate,
}: ListDropdownProps<T>) {
  const [choice, setChoice] = useAtom(atom)
  const handleChange = useCallback(
    (e: SelectChangeEvent) => {
      const val = e.target.value
      setChoice(handleUpdate ? handleUpdate(val) : val)
    },
    [setChoice, handleUpdate],
  )
  return (
    <FormControl size="small">
      <InputLabel>{label}</InputLabel>
      <Select label="Level" onChange={handleChange} value={choice.toString()}>
        {options.map((item) => (
          <MenuItem key={item.toString()} value={item.toString()}>
            {item}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
