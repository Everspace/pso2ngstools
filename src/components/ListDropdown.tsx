import {
  SelectChangeEvent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material"
import { useAtomValue, useSetAtom, WritableAtom } from "jotai"
import { RESET } from "jotai/utils"
import { Stringable } from "pureTypes"

type ListDropdownProps<Value extends Stringable> = {
  label: string
  atom: WritableAtom<Value, [val: Value | typeof RESET], void>
  options: Value[]
  handleUpdate: (value: string, prior: Value) => Value
}

export function ListDropdown<Value extends Stringable>({
  label,
  options,
  atom,
  handleUpdate,
}: ListDropdownProps<Value>) {
  const choice = useAtomValue(atom)
  const setChoice = useSetAtom(atom) as (
    val: Value | typeof RESET | ((prior: Value) => Value),
  ) => void
  const handleChange = (e: SelectChangeEvent) => {
    const val = e.target.value
    setChoice((prior: Value) => handleUpdate(val, prior))
  }
  const handleReset = () => {
    setChoice(RESET)
  }

  return (
    <FormControl size="small">
      <InputLabel id={label}>{label}</InputLabel>
      <Select
        id={label}
        label={label}
        onChange={handleChange}
        value={choice.toString()}
        onReset={handleReset}
      >
        {(options as Stringable[]).map((item) => (
          <MenuItem key={item.toString()} value={item.toString()}>
            {item.toString()}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
