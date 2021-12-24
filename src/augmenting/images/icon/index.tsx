import RATKIconRaw from "./NGSUIStatRATK.png"
import SATKIconRaw from "./NGSUIStatSATK.png"
import TATKIconRaw from "./NGSUIStatTATK.png"
import ATKOutlineIconRaw from "./NGSUIStatATKOutline.png"
import DEFOutlineIconRaw from "./NGSUIStatDEFOutline.png"
import { ImageIcon, Icon } from "components/Icon"

export const MeleeIcon: Icon = (props) => (
  <ImageIcon src={SATKIconRaw} {...props} />
)

export const TechIcon: Icon = (props) => (
  <ImageIcon src={TATKIconRaw} {...props} />
)

export const AllAttackIcons: Icon = (props) => (
  <>
    <MeleeIcon {...props} />
    <RangeIcon {...props} />
    <TechIcon {...props} />
  </>
)

export const RangeIcon: Icon = (props) => (
  <ImageIcon src={RATKIconRaw} {...props} />
)

export const ATKOutlineIcon: Icon = (props) => (
  <ImageIcon src={ATKOutlineIconRaw} {...props} />
)

export const DEFOutlineIcon: Icon = (props) => (
  <ImageIcon src={DEFOutlineIconRaw} {...props} />
)
