import { useCallback } from "react"
import { IconButton, InputAdornment, TextField } from "@mui/material"
import { Clear, Search } from "@mui/icons-material"
import { useAtom, WritableAtom } from "jotai"
import { RESET } from "jotai/utils"

interface SearchInputProps {
  Icon?: React.ElementType
  label?: string
  placeholder?: string
  atom: WritableAtom<string, string | typeof RESET>
}

export function SearchInput({
  Icon = Search,
  label = "Search",
  atom,
  placeholder,
}: SearchInputProps) {
  const [state, onChange] = useAtom(atom)

  const handleSearchInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(e.target.value),
    [onChange],
  )

  const clear = useCallback(() => onChange(RESET), [onChange])
  const isEmpty = state === ""
  return (
    <TextField
      placeholder={placeholder}
      value={state}
      InputLabelProps={{ shrink: true }}
      onChange={handleSearchInput}
      size="small"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Icon sx={{ color: "action.active" }} />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              disabled={isEmpty}
              color="error"
              onClick={clear}
              size="small"
            >
              <Clear />
            </IconButton>
          </InputAdornment>
        ),
      }}
      label={label}
      variant="outlined"
    />
  )
}
