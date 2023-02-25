import { ClassAbbreviation } from "augmenting/types"
import { Icon, ImageIcon } from "components/server/Icon"
import Image, { StaticImageData } from "next/image"
import NMesetaIconRaw from "./NGSUIMSTIcon.png"
import UINGSClassBo from "./UINGSClassBo.png"
import UINGSClassBr from "./UINGSClassBr.png"
import UINGSClassFi from "./UINGSClassFi.png"
import UINGSClassFo from "./UINGSClassFo.png"
import UINGSClassGu from "./UINGSClassGu.png"
import UINGSClassHu from "./UINGSClassHu.png"
import UINGSClassRa from "./UINGSClassRa.png"
import UINGSClassTe from "./UINGSClassTe.png"
import UINGSClassWa from "./UINGSClassWa.png"

export const MesetaIcon: Icon = (props) => (
  <ImageIcon {...props} src={NMesetaIconRaw} />
)

const classIconTable: Record<ClassAbbreviation, StaticImageData> = {
  Hu: UINGSClassHu,
  Fi: UINGSClassFi,
  Ra: UINGSClassRa,
  Gu: UINGSClassGu,
  Fo: UINGSClassFo,
  Te: UINGSClassTe,
  Br: UINGSClassBr,
  Bo: UINGSClassBo,
  Wa: UINGSClassWa,
}

type ClassIconProps = Omit<
  React.ComponentProps<typeof Image>,
  "src" | "alt"
> & {
  shortname: ClassAbbreviation
}

export const ClassIcon = ({ shortname, ...props }: ClassIconProps) => {
  return (
    <ImageIcon {...props} alt={shortname} src={classIconTable[shortname]} />
  )
}
