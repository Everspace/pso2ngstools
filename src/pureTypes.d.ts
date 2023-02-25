import type { SxProps, Theme } from "@mui/material/styles"

type WithSx = { sx?: SxProps<Theme> }

interface IStringable {
  toString: () => string
}

type Stringable = number | string | IStringable

type NextAppdirPageProps = {
  params: { slug: string }
  searchParams?: { [key: string]: string | string[] | undefined }
}
