import { AugmentStat } from "augmenting/types"
import { Icon, ImageIcon } from "components/Icon"
import ATKOutlineIconRaw from "./NGSUIStatATKOutline.png"
import DEFOutlineIconRaw from "./NGSUIStatDEFOutline.png"
import RATKIconRaw from "./NGSUIStatRATK.png"
import SATKIconRaw from "./NGSUIStatSATK.png"
import TATKIconRaw from "./NGSUIStatTATK.png"

export const MeleeIcon: Icon = (props) => {
  return <ImageIcon {...props} alt="MATK" src={SATKIconRaw} />
}

export const TechIcon: Icon = (props) => (
  <ImageIcon {...props} alt="TATK" src={TATKIconRaw} />
)

export const AllAttackIcons: Icon = (props) => (
  <>
    <MeleeIcon {...props} />
    <RangeIcon {...props} />
    <TechIcon {...props} />
  </>
)

export const RangeIcon: Icon = (props) => (
  <ImageIcon {...props} alt="" src={RATKIconRaw} />
)

export const ATKOutlineIcon: Icon = (props) => (
  <ImageIcon {...props} alt="" src={ATKOutlineIconRaw} />
)

export const DEFOutlineIcon: Icon = (props) => (
  <ImageIcon {...props} alt="" src={DEFOutlineIconRaw} />
)

export const augmentStatToGlyphInfo: Partial<
  Record<keyof AugmentStat, React.ElementType>
> = {
  potency: AllAttackIcons,
  floorPotency: ATKOutlineIcon,
  damageResist: DEFOutlineIcon,
  meleePotency: MeleeIcon,
  techPotency: TechIcon,
  rangedPotency: RangeIcon,
}
