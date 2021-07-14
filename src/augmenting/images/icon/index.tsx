import { Image, ImageProps } from "semantic-ui-react"

import NMesetaIconRaw from "./NGSUIMSTIcon.png"

import RATKIconRaw from "./NGSUIStatRATK.png"
import SATKIconRaw from "./NGSUIStatSATK.png"
import TATKIconRaw from "./NGSUIStatTATK.png"
import ATKOutlineIconRaw from "./NGSUIStatATKOutline.png"
import DEFOutlineIconRaw from "./NGSUIStatDEFOutline.png"

export const MesetaIcon = (props: ImageProps) => (
  <Image src={NMesetaIconRaw} centered inline {...props} />
)

export const MeleeIcon = (props: ImageProps) => (
  <Image src={SATKIconRaw} centered inline {...props} />
)

export const TechIcon = (props: ImageProps) => (
  <Image src={TATKIconRaw} centered inline {...props} />
)

export const AllAttackIcons = (props: ImageProps) => (
  <>
    <MeleeIcon {...props} />
    <RangeIcon {...props} />
    <TechIcon {...props} />
  </>
)

export const RangeIcon = (props: ImageProps) => (
  <Image src={RATKIconRaw} centered inline {...props} />
)

export const ATKOutlineIcon = (props: ImageProps) => (
  <Image src={ATKOutlineIconRaw} centered inline {...props} />
)

export const DEFOutlineIcon = (props: ImageProps) => (
  <Image src={DEFOutlineIconRaw} centered inline {...props} />
)
