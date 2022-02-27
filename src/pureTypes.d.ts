import type { SxProps, Theme } from "@mui/material/styles"

type WithSx = { sx?: SxProps<Theme> }

interface Stringable {
  toString: () => string
}
