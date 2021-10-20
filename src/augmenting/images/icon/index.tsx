import NMesetaIconRaw from "./NGSUIMSTIcon.png"

import RATKIconRaw from "./NGSUIStatRATK.png"
import SATKIconRaw from "./NGSUIStatSATK.png"
import TATKIconRaw from "./NGSUIStatTATK.png"
import ATKOutlineIconRaw from "./NGSUIStatATKOutline.png"
import DEFOutlineIconRaw from "./NGSUIStatDEFOutline.png"
import { styled } from "@mui/material/styles"

const ImageIcon = styled("img", { name: "ImageIcon" })({
  display: "inline",
  marginRight: 4,
  marginLeft: 4,
})

export const MesetaIcon = (props: JSX.IntrinsicElements["img"]) => (
  <ImageIcon src={NMesetaIconRaw} {...props} />
)

export const MeleeIcon = (props: JSX.IntrinsicElements["img"]) => (
  <ImageIcon src={SATKIconRaw} {...props} />
)

export const TechIcon = (props: JSX.IntrinsicElements["img"]) => (
  <ImageIcon src={TATKIconRaw} {...props} />
)

export const AllAttackIcons = (props: JSX.IntrinsicElements["img"]) => (
  <>
    <MeleeIcon {...props} />
    <RangeIcon {...props} />
    <TechIcon {...props} />
  </>
)

export const RangeIcon = (props: JSX.IntrinsicElements["img"]) => (
  <ImageIcon src={RATKIconRaw} {...props} />
)

export const ATKOutlineIcon = (props: JSX.IntrinsicElements["img"]) => (
  <ImageIcon src={ATKOutlineIconRaw} {...props} />
)

export const DEFOutlineIcon = (props: JSX.IntrinsicElements["img"]) => (
  <ImageIcon src={DEFOutlineIconRaw} {...props} />
)
