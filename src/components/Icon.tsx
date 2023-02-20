import { styled } from "@mui/material"
import Image from "next/image"

export type Icon = (props: React.ComponentProps<typeof Image>) => JSX.Element

export const ImageIcon = styled(Image, { name: "ImageIcon" })({
  display: "inline",
  marginRight: 4,
  marginLeft: 4,
})
