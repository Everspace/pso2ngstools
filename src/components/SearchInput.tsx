import { useCallback } from "react"
import { Box, IconButton, TextField } from "@mui/material"
import { Clear, Search } from "@mui/icons-material"
import { useAtom, WritableAtom } from "jotai"
import { RESET } from "jotai/utils"

interface SearchInputProps {
  Icon?: React.ElementType
  label?: string
  atom: WritableAtom<string, string | typeof RESET>
}

export function SearchInput({
  Icon = Search,
  label = "Search",
  atom,
}: SearchInputProps) {
  const [state, onChange] = useAtom(atom)

  const handleSearchInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(e.target.value),
    [onChange],
  )

  const clear = useCallback(() => onChange(RESET), [onChange])

  return (
    <Box sx={{ display: "flex", alignItems: "flex-end" }}>
      <Icon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
      <TextField
        value={state}
        InputLabelProps={{ shrink: state !== "" }}
        onChange={handleSearchInput}
        label={label}
        variant="standard"
      />
      {state !== "" ? (
        <IconButton color="error" onClick={clear} size="small">
          <Clear />
        </IconButton>
      ) : null}
    </Box>
  )
}
