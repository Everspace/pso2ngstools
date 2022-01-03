import { Replay } from "@mui/icons-material"
import { IconButton, InputAdornment, TextField } from "@mui/material"
import { useAtom } from "jotai"
import { useCallback, useState } from "react"
import { MAX_SKILLPOINTS, skillpointAtom } from "./state/characterState"

export function ChangeSkillpoints() {
  const [skillPoints, setSkillpoints] = useAtom(skillpointAtom)
  const [field, setField] = useState(skillPoints.toString())

  const num = Number(field)
  const error = Number.isNaN(num)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setField(e.target.value)
    },
    [setField],
  )

  const reset = useCallback(() => {
    setField(MAX_SKILLPOINTS.toString())
    setSkillpoints(MAX_SKILLPOINTS)
  }, [setField, setSkillpoints])

  const handleCompute = useCallback(() => {
    if (!error) return setSkillpoints(num)
  }, [error, num, setSkillpoints])

  return (
    <TextField
      sx={{ maxWidth: 130 }}
      label="Skillpoints"
      value={field}
      size="small"
      error={error}
      type="number"
      onChange={handleChange}
      onBlur={handleCompute}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={reset}>
              <Replay />
            </IconButton>
          </InputAdornment>
        ),
      }}
      inputProps={{
        step: 1,
        min: 1,
        inputMode: "numeric",
        pattern: "[1-9][0-9]*",
      }}
      typeof="number"
    />
  )
}
