import { styled } from "@mui/material"

export type Icon = (props: JSX.IntrinsicElements["img"]) => JSX.Element

export const ImageIcon = styled("img", { name: "ImageIcon" })({
  display: "inline",
  marginRight: 4,
  marginLeft: 4,
})
