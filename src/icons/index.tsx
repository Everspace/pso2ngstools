import { ClassAbbreviation } from "augmenting/types"
import { Icon, ImageIcon } from "components/Icon"
import NMesetaIconRaw from "./NGSUIMSTIcon.png"
import UINGSClassBo from "./UINGSClassBo.png"
import UINGSClassBr from "./UINGSClassBr.png"
import UINGSClassFi from "./UINGSClassFi.png"
import UINGSClassFo from "./UINGSClassFo.png"
import UINGSClassGu from "./UINGSClassGu.png"
import UINGSClassHu from "./UINGSClassHu.png"
import UINGSClassRa from "./UINGSClassRa.png"
import UINGSClassSl from "./UINGSClassSl.png"
import UINGSClassTe from "./UINGSClassTe.png"
import UINGSClassWa from "./UINGSClassWa.png"

export const MesetaIcon: Icon = (props) => (
  <ImageIcon src={NMesetaIconRaw} {...props} />
)

const classIconTable: Record<ClassAbbreviation, string> = {
  Hu: UINGSClassHu,
  Fi: UINGSClassFi,
  Ra: UINGSClassRa,
  Gu: UINGSClassGu,
  Fo: UINGSClassFo,
  Te: UINGSClassTe,
  Br: UINGSClassBr,
  Bo: UINGSClassBo,
  Wa: UINGSClassWa,
  Sl: UINGSClassSl,
}

type ClassIconProps = JSX.IntrinsicElements["img"] & {
  shortname: ClassAbbreviation
}

export const ClassIcon = (props: ClassIconProps) => {
  const { shortname, ...otherProps } = props
  return <ImageIcon src={classIconTable[shortname]} {...otherProps} />
}
