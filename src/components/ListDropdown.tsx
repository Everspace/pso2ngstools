import {
  SelectChangeEvent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material"
import { WritableAtom, useAtom, PrimitiveAtom, SetStateAction } from "jotai"
import { Stringable } from "pureTypes"
import { useCallback } from "react"

type ListDropdownProps<
  OptionType extends Stringable,
  AtomType extends Stringable,
> = {
  label: string
  atom:
    | PrimitiveAtom<AtomType>
    | WritableAtom<AtomType, SetStateAction<AtomType>, void>
  options: OptionType[]
  handleUpdate: (value: string, prior: AtomType) => AtomType
}

export function ListDropdown<
  OptionType extends Stringable,
  AtomType extends Stringable,
>({
  label,
  atom,
  options,
  handleUpdate,
}: ListDropdownProps<OptionType, AtomType>) {
  const [choice, setChoice] = useAtom(atom)
  const handleChange = useCallback(
    (e: SelectChangeEvent) => {
      const val = e.target.value
      setChoice((prior: AtomType) => handleUpdate(val, prior))
    },
    [setChoice, handleUpdate],
  )

  return (
    <FormControl size="small">
      <InputLabel>{label}</InputLabel>
      <Select label="Level" onChange={handleChange} value={choice.toString()}>
        {options.map((item) => (
          <MenuItem key={item.toString()} value={item.toString()}>
            {item.toString()}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
