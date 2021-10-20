import NMesetaIconRaw from "./NGSUIMSTIcon.png"

import RATKIconRaw from "./NGSUIStatRATK.png"
import SATKIconRaw from "./NGSUIStatSATK.png"
import TATKIconRaw from "./NGSUIStatTATK.png"
import ATKOutlineIconRaw from "./NGSUIStatATKOutline.png"
import DEFOutlineIconRaw from "./NGSUIStatDEFOutline.png"

export const MesetaIcon = (props: JSX.IntrinsicElements["img"]) => (
  <img src={NMesetaIconRaw} style={{ display: "inline" }} {...props} />
)

export const MeleeIcon = (props: JSX.IntrinsicElements["img"]) => (
  <img src={SATKIconRaw} style={{ display: "inline" }} {...props} />
)

export const TechIcon = (props: JSX.IntrinsicElements["img"]) => (
  <img src={TATKIconRaw} style={{ display: "inline" }} {...props} />
)

export const AllAttackIcons = (props: JSX.IntrinsicElements["img"]) => (
  <>
    <MeleeIcon {...props} />
    <RangeIcon {...props} />
    <TechIcon {...props} />
  </>
)

export const RangeIcon = (props: JSX.IntrinsicElements["img"]) => (
  <img src={RATKIconRaw} style={{ display: "inline" }} {...props} />
)

export const ATKOutlineIcon = (props: JSX.IntrinsicElements["img"]) => (
  <img src={ATKOutlineIconRaw} style={{ display: "inline" }} {...props} />
)

export const DEFOutlineIcon = (props: JSX.IntrinsicElements["img"]) => (
  <img src={DEFOutlineIconRaw} style={{ display: "inline" }} {...props} />
)
