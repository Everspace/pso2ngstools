import { Replay } from "@mui/icons-material"
import { InputAdornment, IconButton, TextField } from "@mui/material"
import { PrimitiveAtom, useAtom, WritableAtom } from "jotai"
import { WithSx } from "pureTypes"
import { useState, useCallback, useMemo } from "react"

type BaseNumberInputDropdownProps = {
  label: string
  atom: PrimitiveAtom<number> | WritableAtom<number, number>
  max?: number
  step?: number
  min?: number
  pattern?: string
  size?: "small" | "medium"
} & WithSx

type NumberInputDropdownProps =
  | BaseNumberInputDropdownProps
  | (BaseNumberInputDropdownProps & {
      resetValue: number
    })

export function NumberInput({
  label,
  atom,
  max = 999,
  step = 1,
  min = 0,
  pattern = "[0-9]*",
  sx,
  size = "small",
  ...otherProps
}: NumberInputDropdownProps) {
  // Have to specify typing here for some reason
  const [value, setValue] = useAtom<number, number, void>(atom)
  const [field, setField] = useState(value.toString())

  const num = Number(field)
  const error = Number.isNaN(num)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setField(e.target.value)
    },
    [setField],
  )

  const ResetComponent = useMemo(() => {
    if (!("resetValue" in otherProps)) return null
    const reset = () => {
      setField(otherProps.resetValue.toString())
      setValue(otherProps.resetValue)
    }
    return (
      <InputAdornment position="end">
        <IconButton onClick={reset}>
          <Replay />
        </IconButton>
      </InputAdornment>
    )
  }, [otherProps, setField, setValue])

  const handleCompute = useCallback(() => {
    if (!error) {
      if (num > max) {
        setValue(max)
        setField(max.toString())
        return
      }
      if (num < min) {
        setValue(min)
        setField(min.toString())
        return
      }
      setValue(num)
      setField(num.toString())
    }
  }, [error, num, max, min, setValue])

  return (
    <TextField
      label={label}
      value={field}
      size={size}
      error={error}
      type="number"
      sx={sx}
      onChange={handleChange}
      onBlur={handleCompute}
      InputProps={{
        endAdornment: ResetComponent,
      }}
      inputProps={{
        step,
        min,
        inputMode: "numeric",
        pattern,
      }}
      typeof="number"
    />
  )
}
